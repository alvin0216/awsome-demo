window.onload = function() {
  var entryDom = document.querySelector('.entry');
  var input = entryDom.querySelector('input');
  var loginBtn = entryDom.querySelector('button');

  var mainPage = document.querySelector('main');
  var userList = mainPage.querySelector('.userList');
  var rtcA = document.getElementById('rtcA');
  var rtcB = document.getElementById('rtcB');

  var account = sessionStorage.account;
  var isCall = false; // 当前是否在呼叫
  var peer = null;

  /**
   * 初始化 socket
   */
  var socket = io.connect(location.origin);
  socket.on('connect', function() {
    console.log('socket 链接成功');
  });

  // 加入房间
  socket.on('joined', function(list, userInfo) {
    console.log(list);
    var text = '';
    list.forEach(item => {
      var prefix = '<li>';
      if (item.account === sessionStorage.account) prefix = '<li class="me">';
      text += prefix + item.account + '</li>';
    });
    userList.innerHTML = text;
  });

  // 监听呼叫
  socket.on('apply', ({ from, to }) => {
    if (isCall) {
      // 收到呼叫 但是当前正在通话中
      reply(from, 3);
    } else {
      if (comfirmConnect(from)) {
        // B 同意创建
        createP2P({ from, to });
        console.log(
          2,
          `B 收到 A 的呼叫，B 现在要回复 A 同意链接 >> 调用 initPeer 创建 perrB, 并且等待 A 的 offer`,
        );
        reply(from, 1);
      } else {
        reply(from, 2);
      }
    }
  });

  /**
   * 收到 B 的回复
   * @param {Object} - to, from, type
   */
  socket.on('reply', async function(data) {
    switch (data.type) {
      case 1:
        alert('对方同意链接');
        console.log(3, 'A 收到 B 的同意链接 >> 调用 initPeer 创建 perrA ');
        await createP2P(data);
        createOffer(data);
        break;

      case 2:
        alert('对方拒绝链接');
        break;

      case 3:
        alert('对方正在通话中');
        break;

      default:
        break;
    }
  });

  socket.on('1v1ICE', data => {
    // 接收到 ICE
    try {
      console.log(
        sessionStorage.account === data.from ? 'A' : 'B',
        '接收到 1v1 ICE',
      );
      peer.addIceCandidate(data.sdp);
    } catch (error) {
      console.log('onIce: ', error);
    }
  });

  socket.on('1v1offer', async data => {
    console.log(5, 'B 收到 A 的 offer, B 创建 answer 通过 1v1answer 传送给 A');
    // 接收offer并发送 answer
    try {
      // 接收端设置远程 offer 描述
      await peer.setRemoteDescription(data.sdp);
      // 接收端创建 answer
      var answer = await peer.createAnswer();
      // 接收端设置本地 answer 描述
      await peer.setLocalDescription(answer);
      // 给对方发送 answer
      socket.emit('1v1answer', {
        from: data.from,
        to: data.to,
        sdp: answer,
      });
    } catch (e) {
      console.log('onOffer: ', e);
    }
  });

  socket.on('1v1answer', async data => {
    // 接收answer
    try {
      await peer.setRemoteDescription(data.sdp); // 呼叫端设置远程 answer 描述
    } catch (e) {
      console.log('onAnswer: ', e);
    }
  });

  function comfirmConnect(from) {
    return window.confirm(`${from} 向你请求视频通话, 是否同意?`);
  }

  /**
   * 呼叫用户
   * to 对方 account  from 是自己的 account
   */
  function apply(account) {
    alert(`呼叫 ${account} 中`);
    console.log(1, `假定 A 呼叫 B, A: ${sessionStorage.account} B: ${account}`);
    socket.emit('apply', { to: account, from: sessionStorage.account });
  }

  /**
   * 回复 from
   */
  function reply(from, type) {
    socket.emit('reply', { from, to: sessionStorage.account, type });
  }

  // === 创建 peer
  async function createP2P(data) {
    var mediaStream = await getUserMedia({ audio: true, video: true });
    playVideo(rtcA, mediaStream);
    await initPeer(data, mediaStream);
  }

  function initPeer({ from, to }, mediaStream) {
    // 创建输出端 PeerConnection
    var PeerConnection =
      window.RTCPeerConnection ||
      window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection;

    peer = new PeerConnection();
    peer.addStream(mediaStream);

    // 监听ICE候选信息 如果收集到，就发送给对方
    peer.onicecandidate = event => {
      if (event.candidate) {
        var target = from === sessionStorage.account ? to : from;
        socket.emit('1v1ICE', { target, sdp: event.candidate, from, to });
      }
    };

    peer.onaddstream = event => {
      // 监听是否有媒体流接入，如果有就赋值给 rtcB 的 src
      playVideo(rtcB, event.stream);
    };
  }

  async function createOffer({ from, to }) {
    try {
      console.log(
        4,
        'peerA 创建成功，peerA 生成 offer，并触发 1v1offer 传送给 B',
      );
      var offerOption = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
      };

      var offer = await peer.createOffer(offerOption);
      await peer.setLocalDescription(offer); // 呼叫端设置本地 offer 描述
      // 给对方发送 offer
      socket.emit('1v1offer', { from, to, sdp: offer });
    } catch (error) {
      console.log('createOffer: ', error);
    }
  }

  socket.on('disconnect', function() {
    console.log('socket disconnect');
  });

  function playVideo(videDom, mediaStream) {
    if ('srcObject' in videDom) {
      videDom.srcObject = mediaStream;
    } else {
      // 防止在新的浏览器里使用它，应为它已经不再支持了
      videDom.src = window.URL.createObjectURL(mediaStream);
    }
  }

  /**
   * 初始化用户
   */
  function initAccount(account) {
    // === 当前已经登录
    if (account) {
      entryDom.style.display = 'none';
      mainPage.style.display = 'block';

      socket.emit('join', { account: account, roomId: 'webrtc-demo' });

      userList.addEventListener(
        'click',
        function(e) {
          if (e.target.tagName.toLowerCase() === 'li') {
            if (e.target.innerText !== account) {
              apply(e.target.innerText); // 拨打
            }
          }
        },
        true,
      );
    } else {
      // === 当前未登录
      loginBtn.addEventListener(
        'click',
        function(e) {
          if (input.value) {
            sessionStorage.account = input.value;
            initAccount(input.value);
          }
        },
        false,
      );
      // entryDom
    }
  }

  initAccount(account);
};
