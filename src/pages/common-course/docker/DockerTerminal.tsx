import React, { useEffect, useRef, useState } from 'react';
import 'xterm/css/xterm.css';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import SockJS from 'sockjs-client';
import { Modal } from 'antd';
import * as APP from '@/app';
interface DockerExecProps {
  containerId: string;
}

const DockerTerminal: React.FC<DockerExecProps> = ({ containerId }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  let term: Terminal | null = null;
  let socket: SockJS | null = null;
  const socketRef = useRef<SockJS | null>(null); // Use useRef for socket
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  useEffect(() => {
    initTerm();
    initSocket();

    return () => {
      if (socket) {
        console.log("socket关闭");
        socket.close();
      }
      if (term) {
        term.dispose();
      }
    };
  }, []);

  const initTerm = () => {
    term = new Terminal({
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 1000,
      tabStopWidth: 8,
      allowProposedApi: true,
      rows: 44,
      //cols: 80,
      fontFamily: 'Consolas, monospace',
      fontSize: 14,
      fontWeightBold: 'bold',
      screenReaderMode: true,
      rightClickSelectsWord: true,
      theme: {
        foreground: '#24cc3d',
      },
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    if (terminalRef.current) {
      term.open(terminalRef.current);
      fitAddon.fit();
      term.focus();

      window.addEventListener('resize', () => {
        fitAddon.fit();
      });
    }
  
  };

  const initSocket = () => {
    const apiUrl=`${APP.request.prefix}`.replace('http', 'ws');
    console.log("后台地址=", `${APP.request.prefix}`.replace('http', 'ws'));

    const url = `${apiUrl}/stomp/websocketJS?containerId=${containerId}`;
    if (window.WebSocket) {
      socket = new WebSocket(url);
      socket.onopen = () => {
        console.log('hello there!');
        if (term) {
          term.write('Connecting...\r\n');
        }
        if (socket) {
          console.log("socket1=" + socket);
          socket.send(JSON.stringify({ operate: 'connect' }));
        }
       
        if (term) {
          term.onData((data) => {
            if (socket) {
              socket.send(JSON.stringify({ operate: 'command', command: data }));
            }
          });
        }
      };

      socket.onmessage = (evt) => {
        const data = evt.data.toString();
        if (term) {
          term.write(data);
          console.log(data);
          if (data.includes("rz waiting to receive")) {
            setShowModal(true);
          }
        }
      };

      socket.onclose = () => {
        // Socket 关闭时的处理
        console.log("Socket 关闭.");
      };

      socket.onerror = (error) => {
        if (term) {
          term.write('Error: ' + error + '\r\n');
        }
      };
      socketRef.current = socket; // Set the socket in the ref
    } else {
      if (term) {
        term.write('Error: WebSocket Not Supported\r\n');
      }
    }
  };

  // 处理文件上传
  const handleFileUpload = () => {
    console.log("socket2" + socketRef.current);
    if (selectedFile && socketRef.current) {
      // 检查 WebSocket 会话是否仍然打开
      if (socketRef.current.readyState === WebSocket.OPEN) {
        const reader = new FileReader();
        // 读取文件内容
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = () => {
          if (reader.readyState === FileReader.DONE) {
            // 发送 BinaryMessage 到后端
            // const binaryData = new Uint8Array([1, 2, 3, 4, 5]);
            // socketRef.current.send(binaryData.buffer);
            socketRef.current.send(reader.result);
          }
          // 关闭文件选择框
          setShowModal(false);
        };


      } else {
        console.log("WebSocket 会话已关闭");
        // 这里可以添加处理会话已关闭的逻辑
      }
    }
  };




  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="father">
      <div className="window">
        <div>
        <div ref={terminalRef} className="terminal"></div>
        </div>
        
      </div>
      {/* Modal 弹出框 */}
      <Modal
        open={showModal}
        onOk={(e) => handleFileUpload()}
        onCancel={closeModal}
        title="选择上传文件"
      >
        {/* 添加文件上传逻辑，显示文件选择框等 */}
        <input type="file" onChange={(e) => setSelectedFile(e.target.files![0])} />
      </Modal>
    </div>
  );
};

export default DockerTerminal;
