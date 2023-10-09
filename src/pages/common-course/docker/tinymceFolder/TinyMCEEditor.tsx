import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import * as APP from '@/app';
import { message } from 'antd';
const TinyMCEEditor = ({ initialValue,onEditorChange, experimentId }) => {
  const [key, setKey] = useState(experimentId); // 唯一的 key
  const [value, setValue] = useState(initialValue ?? '');

//初始化值
  useEffect(() => setValue(initialValue ?? ''), [initialValue]);

  useEffect(() => {
    setKey(experimentId); // 增加 key 的值
  }, [experimentId]);

 

 

  const imagesUploadHandler = (blobInfo, progress) => new Promise((resolve, reject) => {
    let formData = new FormData()
    formData.append('file', blobInfo.blob())
    const fakeUploadApi = `${APP.request.prefix}/experiment/upload-image`;
    fetch(fakeUploadApi, {
      method: 'POST',
      body: formData,
      headers: {
        "authorization": `Bearer ${localStorage.getItem("access_token")}`
      },
    }).then(response => response.json())
      .then(data => {
        console.info(data);
        const url = data.obj; // 从后端获取的HTMLurl地址
        let baseurl = `${APP.request.prefix}/readResourse/`
        const parts = url.split(/[\\/]/);
        const fileName = parts[parts.length - 1];
        var extractedPath = baseurl + "img/" + fileName;
        console.info(extractedPath);
        resolve(extractedPath)
      })
      .catch(error => {
        // 处理上传失败
        console.error('Image upload error:', error);
        reject('Image upload failed');
      });
  })



  // 自定义文件选择器回调函数
  const customFilePicker = async (cb, value, meta) => {
    if (meta.filetype == 'media') {
      // 创建一个<input>元素，允许用户选择文件
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      //input.setAttribute('accept', 'image/*'); // 设置可接受的文件类型
      // input.style.display = 'none'; // 隐藏输入框

      // 当用户选择文件后，触发回调函数，并传递所选文件的信息
      input.onchange = async function () {
        const file = this.files[0];
        console.log(file.name);
        const formData = new FormData();
        formData.append('file', file);
        const fakeUploadApi = `${APP.request.prefix}/experiment/upload-image`;
        // 使用Fetch API将文件上传到服务器
        fetch(fakeUploadApi, {
          method: 'POST',
          body: formData,
          headers: {
            "authorization": `Bearer ${localStorage.getItem("access_token")}`
          },
        }).then(response => response.json())
          .then(data => {
            const url = data.obj;
            let baseurl = `${APP.request.prefix}/readResourse/`
            const parts = url.split(/[\\/]/);
            const fileName = parts[parts.length - 1];
            var extractedPath = baseurl + "img/" + fileName;
            console.log(extractedPath);
            cb(extractedPath);
          })
          .catch(error => {
            console.error('视频上传失败:', error);
          });

      };

      // 触发文件选择对话框
      input.click();
    }
  };
 
//初始化配置
  const reactDemoInit = {
    language: 'zh_CN',
    height: '100%', // 编辑器高度
    menubar: true, // 隐藏菜单栏
    statusbar: false,
    paste_convert_word_fake_lists: false, // 插入word文档需要该属性
    branding: false, //tiny技术支持信息是否显示
    paste_data_images: true, //图片是否可粘贴
    valid_elements: '*[*]', // 这里使用 *[*] 表示保留所有元素和属性
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'powerpaste', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
    ],
    toolbar: ' customfileupload | ' + 'undo redo | blocks | ' +
      'bold italic forecolor | alignleft aligncenter ' + ' uploadimg image media ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | help',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
    powerpaste_allow_local_images: true,
    powerpaste_word_import: 'prompt',
    powerpaste_html_import: 'prompt',
    images_upload_handler: imagesUploadHandler,
    file_picker_callback: customFilePicker, // 使用自定义文件选择器
    setup: function (editor) {
      // 自定义按钮点击事件
      editor.ui.registry.addButton('customfileupload', {
        text: '文件上传',
        onAction: function () {
          // 打开文件选择对话框
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.style.display = 'none';
          input.addEventListener('change', function () {
            const file = this.files[0];
            // 处理所选文件，可以上传到服务器等操作
            // 将文件插入到编辑器中
            // 创建一个FormData对象，用于将文件上传到服务器
            const formData = new FormData();
            formData.append('file', file);
            const fakeUploadApi = `${APP.request.prefix}/experiment/upload-image`;
            // 使用Fetch API将文件上传到服务器
            fetch(fakeUploadApi, {
              method: 'POST',
              body: formData,
              headers: {
                "authorization": `Bearer ${localStorage.getItem("access_token")}`
              },
            }).then(response => response.json())
              .then(data => {
                if (data.success) {
                  const url = data.obj; // 从后端获取的HTMLurl地址
                  console.log("dataobj=", url);
                  let baseurl = `${APP.request.prefix}/readResourse/`
                  const fileName = file.name;
                  const ext = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase(); // 获取文件扩展名
                  //视频
                  if (ext === 'mp4' || ext === 'avi' || ext === 'mkv' || ext === 'mov' || ext === 'wmv') {
                    const parts = url.split(/[\\/]/);
                    const fileName = parts[parts.length - 1];
                    var extractedPath = baseurl + "img/" + fileName;
                    const videoHtml = '<p><video width="300" height="150" controls="controls"><source src="' + extractedPath + '" type="video/mp4"></video></p>';
                    editor.insertContent(videoHtml);
                  }
                  //图片
                  if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'bmp' || ext === 'gif' || ext === 'EPS' || ext === 'jfif') {
                    const parts = url.split(/[\\/]/);
                    const fileName = parts[parts.length - 1];
                    var extractedPath = baseurl + "img/" + fileName;
                    const imgHtml = '<p><img  width="500" height="500" alt="" src="' + extractedPath + '"></img></p>';
                    editor.insertContent(imgHtml);
                  }
                  //ppt pdf xls 
                  if (ext === 'ppt' || ext === 'pptx' || ext === 'pdf' || ext === 'xls' || ext === 'xlsx') {
                    //ppt走这里处理逻辑
                    const ppthtml = data.obj;
                    // 使用正则表达式来匹配 <img> 标签中的 src 属性
                    const regex = /<img[^>]*src=["'](.*?)["']/g;
                    // 使用 replace 方法来替换匹配到的 src 属性的内容，保持其他属性不变
                    const newres = ppthtml.replace(regex, (match, src) => {
                      const originalSrc = src;
                      const newSrc = baseurl + "ppt/" + src.substring(src.indexOf('doc2htmltest') + 13);
                      return match.replace(originalSrc, newSrc);
                    });
                    editor.insertContent(newres);
                  }
                  if (ext === 'doc' || ext === 'docx') {
                    var extractedPath = baseurl + "upload/" + url.substring(url.indexOf('doc2htmltest') + 13);
                    //word走下面处理逻辑
                    fetch(extractedPath, {
                      method: 'GET',
                      headers: {
                        "authorization": `Bearer ${localStorage.getItem("access_token")}`
                      },
                    }).then(response => response.text()) // 提取响应的文本内容
                      .then(res => {
                        if (data.success) {
                          // 将上传的html的形式插入到编辑器中
                          console.log(res)
                          // 使用正则表达式来匹配 <img> 标签中的 src 属性
                          const regex = /<img[^>]*src=["'](.*?)["']/g;
                          // 使用 replace 方法来替换匹配到的 src 属性的内容，保持其他属性不变
                          const newres = res.replace(regex, (match, src) => {
                            const originalSrc = src;
                            const parts = extractedPath.split("content.html");
                            const prefix = parts[0];
                            const newSrc = prefix + originalSrc; // 将前缀添加到原来的 src 前面
                            return match.replace(originalSrc, newSrc);
                          });
                          editor.insertContent(newres);
                        } else {
                          message.error(data.message);
                        }

                      })
                      .catch(error => {
                        console.error('文件上传失败:', error);
                        message.error(error);
                      });
                  }
                } else {
                  message.error(data.message);
                }

              })
              .catch(error => {
                console.error('文件上传失败:', error);
                message.error(error);
              });
          });
          document.body.appendChild(input);
          input.click();
        },
      });
    },
  };
//内容变化
  const handleEditorChange=(newValue, editor)=>{
    setValue(newValue);
    onEditorChange(newValue);
  }
  return (
    <>
      <Editor
        key={key} // 使用唯一的 key
        //onInit={onEditorInit}
        initialValue={initialValue} // 初始内容
        value={value}
        init={reactDemoInit}
        //onEditorChange={handleEditorChange} // 内容变化时的回调函数
        onEditorChange={handleEditorChange}
      />
    </>
  );
};

export default TinyMCEEditor;
