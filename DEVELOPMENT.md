## Development

Ilk olarak @BotFather botundan kendinize bot olusturun. Sirasiyla:

	/start

	/newbot
	
	${Sizin_Botunuzun_Ismi}

Sonrasinda @BotFather size botunuzun token degerini ve telegram linkini gonderecektir.

Daha sonra bot kodumuzu calistirin.

```bash
  $ git clone https://github.com/GnuYtuce/gnuytu-telegram-bot
  $ cd gnuytu-telegram-bot
  $ npm install
  $ TOKEN=${YOUR_TOKEN} \
    MONGO_URL=${YOUR_MONGO_URL} \
    node index.js
```

Kodu calistirdiktan sonra telegram botu ile mesajlasmaya calisin.
