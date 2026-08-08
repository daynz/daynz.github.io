# Socket编程

## 概要

1. 创建套接字`socket()`
2. 分配地址和端口`bind()`
3. 转为可接收请求状态`listen()`
4. 受理连接请求`accept()`

## 基于Linux平台的实现

### 服务器端

```C++
#include <iostream>
#include <string>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <cstring>
#include <unistd.h>
```

```C++
void ErrorHandling(const char *message);

int main(int argc, char *argv[])
{
    int serv_sock;
    int clnt_sock;
    
    struct sockaddr_in serv_addr;
    struct sockaddr_in clnt_addr;
    socklen_t clnt_addr_size;
    
    char message[] = "Hello World!";
    
    if (argc != 2)
    {
        std::cout << "Usage : " << argv[0] << " <port>" << std::endl;
        exit(0);
    }
	// 1. 创建套接字
    serv_sock = socket(PF_INET, SOCK_STREAM, 0);
    
    if (serv_sock == -1)
    {
        ErrorHandling("socket() error");
    }
    
    memset(&serv_addr, 0, sizeof(serv_addr));
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_addr.s_addr = htonl(INADDR_ANY);
    serv_addr.sin_port = htons(atoi(argv[1]));
    
	// 2. 分配地址和端口
    if (bind(serv_sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) == -1)
    {
        ErrorHandling("bind() error");
    }
    
	// 3. 转为可接收请求状态
    if (listen(serv_sock, 5) == -1)
    {
        ErrorHandling("listen() error");
    }
    
    clnt_addr_size = sizeof(clnt_addr);
    // 4. 受理连接请求
    clnt_sock = accept(serv_sock, (struct sockaddr *)&clnt_addr, &clnt_addr_size);
    if (clnt_sock == -1)
    {
        ErrorHandling("accept() error");
    }
    
    write(clnt_sock, message, sizeof(message));
    close(clnt_sock);
    close(serv_sock);
    
    return 0;
}

void ErrorHandling(const char *message)
{
    fputs(message, stderr);
    fputc('\n', stderr);
    exit(1);
}
```
### 客户端

```C++
#include <iostream>
#include <string>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <cstring>
#include <unistd.h>
```

```C++
void ErrorHandling(const char* message);

int main(int argc,char* argv[])
{
    int sock;
    struct sockaddr_in serv_addr;
    char message[30];
    int str_len;
    if (argc != 3)
    {
        std::cout << "Usage : " << argv[0] << " <IP> <PORT>" << std::endl;
        exit(1);
    }
    sock = socket(PF_INET, SOCK_STREAM, 0);

    if (sock == -1)
    {
        ErrorHandling("sock() error");
    }
    memset(&serv_addr, 0, sizeof(serv_addr));
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_addr.s_addr = inet_addr(argv[1]);
    serv_addr.sin_port = htons(atoi(argv[2]));
    if (connect(sock, (struct sockaddr*)&serv_addr, sizeof(serv_addr)) == -1)
    {
        ErrorHandling("connect() error");
    }
    str_len = read(sock, message, sizeof(message) - 1);
    if (str_len == -1)
    {
        ErrorHandling("read() error");
    }
    std::cout << "Message from server : " << message << std::endl;
    close(sock);
    return 0;
}
void ErrorHandling(const char* message)
{
    fputs(message, stderr);
    fputc('\n', stderr);
    exit(1);
}
```
### 文件操作

Linux中，socket和文件操作没有区别。

文件描述符：系统分配给文件或套接字的整数。经过常见过程才创建套接字。

#### 文件操作相关的函数

**打开文件`open()`**

```c++
int open(const char *path, int flag);
```
> path：文件名的字符串地址。
> flag：文件打开模式的信息。

| 选项名称 | 描述 | 
|---------|------|
| `O_RDONLY` | 以只读方式打开文件。 |
| `O_WRONLY` | 以只写方式打开文件。 |
| `O_RDWR` | 以读写方式打开文件。 |
| `O_APPEND` | 设置文件偏移量到文件末尾，所有写操作都会追加到文件末尾。 |
| `O_CREAT` | 如果文件不存在，则创建文件。 |
| `O_TRUNC` | 如果文件存在，将其长度截断为0。 |
| `O_EXCL` | 与`O_CREAT`一起使用，如果文件已存在，则`open()`调用失败。 |
| `O_NONBLOCK` | 使文件描述符处于非阻塞模式。 |
| `O_SYNC` | 所有写操作都同步到磁盘，数据才被视为写入成功。 |
| `O_ASYNC` | 使文件描述符处于异步模式，可以用于信号驱动的I/O。 |
| `O_DIRECT` | 尝试直接将数据发送到设备，绕过文件系统缓存。 |
| `O_LARGEFILE` | 允许打开大于2GB的文件。 |
| `O_NOCTTY` | 阻止终端设备成为进程的控制终端。 |
| `O_NOFOLLOW` | 如果路径是一个符号链接，`open()`调用将失败。 |
| `O_CLOEXEC` | 设置文件描述符的`FD_CLOEXEC`标志，使得在执行`exec()`系列函数时自动关闭该文件描述符。 |
| `O_PATH` | 仅获取文件路径，不打开文件。 |
| `O_TMPFILE` | 创建一个临时文件，如果与`O_DIRECTORY`一起使用，确保文件在目录中创建。 |
| `O_DSYNC` | 类似于`O_SYNC`，但只保证数据的同步写入。 |

**关闭文件`close()`**

```C++
int close(int fd);
```
> fd：需要关闭的文件或套接字的文件描述符。

**将数据写入文件`write()`**

```C++
ssize_t write(int fd, const void * buf, size_t nbytes);
```
> fd：显示数据传输对象的文件描述符。
> buf：保存要传输数据的缓冲地址值。
> nbytes：要传输数据的字节数。

**读取文件中的数据`read()`**

```C++
ssize_t read(int fd, void * buf, size_t nbytes);
```
> fd：显示数据传输对象的文件描述符。
> buf：保存接收数据的缓冲地址值。
> nbyes：要接收数据的字节数。

## 基于Windows平台的实现
### 服务器端

```C++
#include <iostream>
#include <string>
#include <winsock2.h>
```

```C++
void ErrorHandling(const char *message);

int main(int argc, char *argv[])
{
    WSADATA wsaData;
    SOCKET hServSock, hClntSock;
    SOCKADDR_IN servAddr, clntAddr;
    int szClntAddr;
    char message[] = "Hello World!";
    
    if (argc != 2)
    {
        std::cout << "Usage : " << argv[0] << " <port>" << std::endl;
    }
    
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0)
    {
        ErrorHandling("WSAStartuop() error");
    }
    
    hServSock = socket(PF_INET, SOCK_STREAM, 0);
    
    if (hServSock == INVALID_SOCKET)
    {
        ErrorHandling("socket() error");
    }
    memset(&servAddr, 0, sizeof(servAddr));
    servAddr.sin_family = AF_INET;
    servAddr.sin_addr.s_addr = htonl(INADDR_ANY);
    servAddr.sin_port = htons(atoi(argv[1]));
    
    if (bind(hServSock, (SOCKADDR *)&servAddr, sizeof(servAddr)) == SOCKET_ERROR)
    {
        ErrorHandling("bind() error");
    }
    
    if (listen(hServSock, 5) == SOCKET_ERROR)
    {
        ErrorHandling("listen() error");
    }
    
    szClntAddr = sizeof(clntAddr);
    hClntSock = accept(hServSock, (SOCKADDR *)&clntAddr, &szClntAddr);
    if (hClntSock == INVALID_SOCKET)
    {
        ErrorHandling("accept() error");
    }
    
    send(hClntSock, message, sizeof(message), 0);
    closesocket(hClntSock);
    closesocket(hServSock);
    WSACleanup();
    return 0;
}

void ErrorHandling(const char *message)
{
    fputs(message, stderr);
    fputc('\n', stderr);
    exit(1);
}
```
### 客户端

```C++
#include <iostream>
#include <string>
#include <winsock2.h>
```

```C++
void ErrorHandling(const char* message);

int main(int argc,char* argv[])
{
    WSADATA wsaData;
    SOCKET hSocket;
    SOCKADDR_IN servAddr;
    
    char message[255];
    int strlen;
    if (argc != 3)
    {
        std::cout << "usage: " << argv[0] << "<IP> <port>" << std::endl;
    }
	if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0)
	{
		ErrorHandling("WSAStartup() error");
	}
	
	hSocket = socket(PF_INET, SOCK_STREAM, 0);
	if (hSocket == INVALID_SOCKET)
	{
		ErrorHandling("socket() error");
	}
	
	memset(&servAddr, 0, sizeof(servAddr));
	servAddr.sin_family = AF_INET;
	servAddr.sin_addr.s_addr = inet_addr(argv[1]);
	servAddr.sin_port = htons(atoi(argv[2]));

	if (connect(hSocket,(SOCKADDR*)&servAddr,sizeof(servAddr)) == SOCKET_ERROR)
	{
		ErrorHandling("connect() error");
	}
	
	strlen = recv(hSocket, message, sizeof(message) - 1, 0);
	if (strlen == -1)
	{
		ErrorHandling("read() error");
	}
	std::cout << "message from server : " << message << std::endl;
	
	closesocket(hSocket);
	WSACleanup();
	
    return 0;
}

void ErrorHandling(const char* message)
{
	fputs(message, stderr);
	fputc('\n', stderr);
	exit(1);
}
```

### Windows的I/O函数

**数据传输函数`send()`**

```C++
int send(SOCKET s, const char * buf, int len, int flags);
```
> s：表示数据传输对象连接的套接字句柄。
> buf：保存要传输数据的缓冲地址值。
> len：要接收数据的字节数。
> flags：传输数据时用到的选项。

**数据接收函数`secv()`**

```C++
int recv(SOCKET s, const char * buf, int len, int flags);
```
> s：表示数据接收对象连接的套接字句柄。
> buf：保存要接收数据的缓冲地址值。
> len：要接收数据的字节数。
> flags：接收数据时用到的选项。

## 细节

### 创建套接字`socket()`

```C++
int socket(int domain, int type, int protocol);
```
> `domain`：套接字中使用的协议簇信息。
> `type`：数据传输类型信息。
> `protocol`：使用的协议信息。

#### 协议簇`domain`

| 协议族         | 描述                                |
| ----------- | --------------------------------- |
| `PF_INET`   | IPv4互联网协议族，用于传统的IP网络通信。           |
| `PF_INET6`  | IPv6互联网协议族，用于新一代的IP网络通信。          |
| `PF_LOCAL`  | 本地通信的UNIX协议族，通常用于Unix域套接字。        |
| `PF_PACKET` | 底层套接字协议族，提供对网络层的直接访问。             |
| `PF_IPX`    | IPX Novell协议族，用于Novell NetWare网络。 |

#### 套接字类型

#### 面向连接的套接字(SOCK_STREAM)

面向连接的套接字（Connection-oriented sockets）是指在数据传输开始之前，必须在两端的套接字之间建立一个连接。这种类型的套接字提供了可靠的数据传输服务，确保数据按顺序、完整地到达目的地。以下是面向连接的套接字的一些关键特性和相关的协议：

**关键特性**

| 特性 | 描述 |
|------|------|
| 连接建立 | 在数据传输前，必须建立一个连接。 |
| 数据传输 | 数据按顺序发送，并保证数据的完整性。 |
| 流量控制 | 避免发送方数据溢出接收方的缓冲区。 |
| 拥塞控制 | 避免网络过载，确保网络资源的有效使用。 |
| 可靠性 | 提供错误检测和修正机制，确保数据可靠传输。 |

**相关协议**

| 协议 | 描述 |
|------|------|
| TCP（传输控制协议） | 最常见的面向连接的协议，提供可靠的、有序的和错误检测功能。 |
| SCTP（流控制传输协议） | 另一种面向连接的协议，支持多宿主和多路径传输。 |
| DCCP（数据报拥塞控制协议） | 一种面向连接的协议，旨在为需要较少可靠性的数据流提供快速传输。 |

**面向连接的套接字的工作流程**

1. **服务器套接字监听**：服务器端的套接字处于监听状态，等待客户端的连接请求。
2. **客户端连接请求**：客户端套接字向服务器发送连接请求。
3. **三次握手**：TCP使用三次握手过程来建立连接，确保双方都准备好进行通信。
4. **数据传输**：一旦连接建立，数据就可以在客户端和服务器之间传输。
5. **连接终止**：数据传输完成后，通过四次挥手过程来终止连接。

**使用场景**

面向连接的套接字适用于需要可靠数据传输的应用，例如：

- 网页浏览（HTTP/HTTPS）
- 文件传输（FTP）
- 电子邮件传输（SMTP）
- 远程登录（SSH）
- 网络游戏和虚拟环境

这些应用需要确保数据的完整性和顺序，因此面向连接的套接字提供了必要的保障。

#### 面向消息的套接字(SOCK_DGRAM)

面向消息的套接字（Message-oriented sockets）是一种通信机制，它允许应用程序以消息为单位发送和接收数据。这种类型的套接字不保证消息的顺序，也不保证消息的可靠传输，它提供了一种类似于邮局的通信方式，其中每条消息都是独立的，并且可以独立地路由和传输。

**关键特性**

| 特性 | 描述 |
|------|------|
| 无连接 | 不需要建立持久的连接就可以发送消息。 |
| 消息边界 | 消息发送时的边界在接收时仍然保持，不会因为网络传输而被破坏。 |
| 可能的丢失 | 消息可能会在传输过程中丢失，不保证到达。 |
| 可能的重复 | 由于网络或其他因素，消息可能会被重复发送。 |
| 顺序不确定性 | 消息可能不会按照发送的顺序到达。 |
| 低延迟 | 适合需要快速发送，但不需要保证可靠性的应用。 |

**相关协议**

| 协议 | 描述 |
|------|------|
| UDP（用户数据报协议） | 最常见的面向消息的协议，提供无连接的、不可靠的数据传输服务。 |
| DCCP（数据报拥塞控制协议） | 一种面向消息的协议，提供了拥塞控制功能，但不保证可靠性。 |
| SCTP（流控制传输协议） | 虽然SCTP主要是面向连接的，但它也支持消息边界的传输。 |

**面向消息的套接字的工作流程**

1. **消息发送**：发送方将数据封装成消息并发送。
2. **消息传输**：消息通过网络传输，可能经历丢失、重复或重新排序。
3. **消息接收**：接收方接收消息，每个消息保持其发送时的边界。

**使用场景**

面向消息的套接字适用于以下类型的应用：

- 网络语音通信（VoIP）
- 视频流（尤其是实时视频会议）
- 网络游戏中的实时通信
- 传感器网络，其中传感器数据以消息形式发送
- 任何需要快速传输但对数据丢失有一定的容忍度的应用

这些应用通常更关心数据的及时性而不是数据的完整性，因此面向消息的套接字提供了一种高效的方式来处理这些需求。

#### 协议

| 协议名称 | 描述 |
|----------|------|
| `IPPROTO_TCP` | 传输控制协议（TCP），提供可靠的、有序的和错误检测功能的面向连接的协议。 |
| `IPPROTO_UDP` | 用户数据报协议（UDP），提供无连接的、不可靠的数据传输服务。 |
| `IPPROTO_SCTP` | 流控制传输协议（SCTP），一种可靠的、面向消息的、基于连接的协议，支持多宿主和多路径传输。 |
| `IPPROTO_TIPC` | 透明互联网协议（TIPC），一种用于分布式应用的协议，提供确定性的报文传输。 |
| `IPPROTO_QUIC` | 快速UDP互联网连接（QUIC），一种基于UDP的新型传输层网络协议，旨在替代TCP，提供更快的连接建立和加密。 |

### 分配地址和端口`bind()`

```C++
itn bind(int sockfd, struct sockaddr* myaddr, socklen_t addrlen);
```
> `sockfd`：要分配的套接字文件描述符。
> `myaddr`：存有地址信息的结构体变量的地址。
> `addrlen`：第二个结构体变量的长度。

#### 结构体`sockaddr`

```C++
struct sockaddr_in {
	short	sin_family;
	u_short	sin_port;
	struct in_addr	sin_addr;
	char	sin_zero[8];
};
```
> `sin_family`：地址族。
> `sin_port`：16位TCP/UDP端口号(以网络字节序保存)。
> `sin_addr`：32位IP地址(以网络字节序保存)。
> `sin_zero`：不使用。

#### 字节序转换为网络字节序

```C++
unsigned short htons(unsigned short);
unsigned short ntohs(unsigned short);
unsigned long htonl(unsigned long);
unsigned long ntohl(unsigned long);
```
> h：主机(host)字节序。
> n：网络(network)字节序。

#### 地址族`sin_family`

| 地址族名称        | 描述             |
| ------------ | -------------- |
| `AF_INET`    | IPv4地址族        |
| `AF_INET6`   | IPv6地址族        |
| `AF_UNIX`    | 本地通信（Unix域套接字） |
| `AF_PACKET`  | 包协议层套接字        |
| `AF_NETLINK` | 内核用户界面设备       |
#### 结构体`in_addr`

```C++
struct in_addr
{
	In_addr_t s_addr;
}
```
>` s_addr`：32位IPv4地址。
