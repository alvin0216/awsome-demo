var constraints = { video: true, audio: true };

/**
 * 获取音频设备
 * @param {Object} options - navigator.mediaDevices.getUserMedia(options)
 * @return {Promise} Promise.resolve(steam) - 返回视频流
 */
function getUserMedia(options = constraints) {
  return new Promise((resolve, reject) => {
    // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }

    // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
    // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function(constraints) {
        // 首先，如果有getUserMedia的话，就获得它
        var getUserMedia =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia ||
          navigator.msGetUserMedia;

        // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
        if (!getUserMedia) {
          return Promise.reject(
            new Error('getUserMedia is not implemented in this browser'),
          );
        }

        // 否则，为老的navigator.getUserMedia方法包裹一个Promise
        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }

    navigator.mediaDevices
      .getUserMedia(options)
      .then(onSuccess)
      .catch(onError);

    function onSuccess(stream) {
      // var video = document.getElementById('rtcA')
      // // 旧的浏览器可能没有srcObject
      // if ('srcObject' in video) {
      //   video.srcObject = stream
      // } else {
      //   // 防止在新的浏览器里使用它，应为它已经不再支持了
      //   video.src = window.URL.createObjectURL(stream)
      // }
      // video.onloadedmetadata = function (e) {
      //   video.play()
      // }
      resolve(stream);
    }

    function onError(err) {
      alert(err.name + ': ' + err.message);
      reject(err);
    }
  });
}
