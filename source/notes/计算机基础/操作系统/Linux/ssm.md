# 内网穿透及SSM

## 内网穿透（Cpolar）

Linux

```sh
cpolar tcp 22 [-region=cn]#可选
```

```sh
cpolar by @bestexpresser                                        (Ctrl+C to quit)
                                                                                
Tunnel Status       online                                                      
Account             daynz (Plan: Free)                                          
Version             3.12/3.18                                                   
Web Interface       127.0.0.1:4040                                              
Forwarding          tcp://8.tcp.cpolar.cn:14101 -> tcp://127.0.0.1:22           
# Conn              0                                                           
Avg Conn Time       0.00ms 
```

Windows(C:\Users\wp\.ssh\config)

```sh
Host dev-ubuntu
    HostName 8.tcp.cpolar.cn
    User whitepaper
    IdentityFile C:/Users/wp/.ssh/zhe
    Port 14101
```

