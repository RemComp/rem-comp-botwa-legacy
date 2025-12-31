Use node 20

1. Install GTK 2
```
https://github.com/Automattic/node-canvas/wiki/Installation:-Windows
```

2. Install Golang
3. Build golang client
```bash
git clone https://github.com/RemComp/wuzapi-go-client
go build
```
5. Copy wuzapi.exe to the RemCp Bot Repo directory

6. Install package
```bash
npm i --omit=dev --force
npm i -g pm2
```

7. Start Bot
```bash
pm2 start wuzapi.exe index_whatsmeow.js

```

8. Search index_whatsmeow id
```bash
pm2 list
```

Example is id 1
```bash
pm2 attach 1
```

9. Connect to WhatsApp
> Wait for the text "Please enter mobile phone number", then enter your phone number with country code, example: 6281234567890

> next you will get code to enter in your WhatsApp