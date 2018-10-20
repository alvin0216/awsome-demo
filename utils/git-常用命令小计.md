[更好地阅读体验戳这里](https://gershonv.github.io/2018/07/10/git-%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4%E5%B0%8F%E8%AE%A1/)

#### git status

![enter description here](https://cdn.liaoxuefeng.com/cdn/files/attachments/001384907702917346729e9afbf4127b6dfbae9207af016000/0)

![git](http://pbj98r3fm.bkt.clouddn.com/git.png)

```javascript
git status // 查看状态 - 红色表示未加入工作区
```

M - 被修改，A - 被添加，D - 被删除，R - 重命名，?? - 未被跟踪

根据上面 git status 命令的提示内容，我们至少可以得到三种命令的使用方式：

> - 暂存文件的命令：**git add <文件名>**
> - 放弃未暂存文件的修改命令：**git checkout -- <文件名>**
> - 将被修改的文件暂存并提交的命令：**git commit -a**

#### 版本回退

```javascript
git log //查看版本记录

//当前版本HEAD
//上一版本HEAD^
//上上版本HEAD^^
//一百版本HEAD~100

//回退到某版本
git reset --hard HEAD^

/*----------重返未来-------------*/
//查看命令记录
git reflog

//重返未来版本
git reset --hard commit_id
```

#### 管理修改

```javascript
git add xx.xx //添暂存区

//交版本库
git commit -m "update sth."

//撤销修改(回到最近一次git commit或git add时的状态)
git checkout -- xxx.xx

or
git reset HEAD xxx.xx
git checkout -- xxx.xx

//删除文件
rm readme.md
git status
/*----------确实要删除-------------*/
git rm readme.md
git commit -m "remove readme.md"
/*----------误删时恢复-------------*/
git checkout -- readme.md
```

#### 远程仓库

```javascript
//创建
git remote add pb https://github.comYMC-GitHub/ticgit

//修改
//重新命名
git remote rename pb paul

//上传
git push origin master
```

#### 分支管理

```javascript
//创建新分支
git branch dev

//转换到分支
git checkout dev

//看当前分支
git branch

//现进行开发

//回到主分支
git checkout master

//把分支合并
git merge dev

//删除某分支
git branch -d dev

//分支策略-开发
git merge --no-ff -m "merge with no-ff" dev

/*************正在dev分支开发时，急需修复master分支上的bug*****************/
//查看状态
git status
//储藏开发
git stash
//添加一些信心备注git stash save 'message...'
//查看状态
git status

//切换分支
git checkout master
//分支创切
git checkout -b issue-101
//修改内容

//交版本库
git add readme.txt
git commit -m "fix bug 101"
//切换分支
git checkout master
//合并分支
git merge --no-ff -m "merged bug fix 101" issue-101
//删除分支
git branch -d issue-101

//切换分支
git checkout dev
//查看状态
git status
//列出储藏
git stash list
//取出储藏
git stash apply
//删除储藏
git stash drop
//列出储藏
git stash list

/*************Feature分支*****************/
//情景：
每添加一个新功能，最好新建一个feature分支，在上面开发，完成后，合并，最后，删除该feature分支。

//分支创切
git checkout -b feature-vulcan
//现在开发

//切换分支
git checkout dev

//删除分支
git branch -d feature-vulcan
//强行删除git branch -D feature-vulcan


/*************多人协作*****************/

//获取远程仓库分支


//查看远程仓库信息
git remote -v

//推本地分支到远程
git push origin master
git push origin dev

//伙伴抓取远程分支
git clone git@github.com:michaelliao/learngit.git
//列出抓的分支列表(只显示master)
git branch
//获取远程开发分支
git checkout -b dev origin/dev
//现在开始开发修改

//之后提交分支
git push origin master
git push origin dev
```
