const fs = require('fs')
const {
  ipcRenderer
} = require('electron')

const mainDrop = document.getElementById('drop')
const trash = document.getElementsByClassName('trash')[0]
const load = document.getElementsByClassName('load')[0]
const trashHead = document.getElementsByClassName('head')[0]

// 与主进程通讯
function sendToMain(name, content) {
  ipcRenderer.sendSync(name, content)
}

// 显示垃圾桶还是load动画
function showLoadOrTrash(isDeleting) {
  if (isDeleting) {
    trash.classList.add('undisplay')
    load.classList.remove('undisplay')
  } else {
    trash.classList.remove('undisplay')
    load.classList.add('undisplay')
  }
}

// 垃圾盖打开or关闭
function openTrashOrClose(haveFile) {
  if (haveFile) {
    mainDrop.style.backgroundColor = '#777777CC'
    trashHead.classList.add('head-open')
  } else {
    mainDrop.style.backgroundColor = '#77777780'
    trashHead.classList.remove('head-open')
  }
}

// 拖拽至目标区域内放手后触发一次
mainDrop.addEventListener('drop', function (e) {
  e.preventDefault()
  const files = e.dataTransfer.files
  if (files) {
    showLoadOrTrash(true)
    const filesLength = files.length
    if (filesLength === 1) {
      //获取文件路径
      const path = files[0].path
      fs.rm(path, {
        recursive: true
      }, function (e) {
        if (e) {
          sendToMain('err', 'had some bugs')
        }
        showLoadOrTrash(false)
        openTrashOrClose(false)
      })
    } else if (filesLength > 1) {
      let index = 0
      rm()

      function rm() {
        if (index < filesLength) {
          const filePath = files[index].path
          fs.rm(filePath, {
            recursive: true
          }, function (e) {
            if (e) {
              showLoadOrTrash(false)
              openTrashOrClose(false)
              sendToMain('err', 'had some bugs')
            } else {
              index++
              rm()
            }
          })
        } else {
          showLoadOrTrash(false)
          openTrashOrClose(false)
        }
      }
    }
  }
})

// 拖动离开区域时触发一次
mainDrop.addEventListener('dragleave', function (e) {
  openTrashOrClose(false)
})

// 拖动进区域时触发一次
mainDrop.addEventListener('dragenter', function (e) {
  openTrashOrClose(true)
})

//阻止拖拽结束事件默认行为，否则drop事件不起效
mainDrop.addEventListener("dragover", (e) => {
  e.preventDefault()
})