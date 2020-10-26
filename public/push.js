var webPush = require('web-push');
 
const vapidKeys = {
    "publicKey":"BLY0SmCd5Vkju3fE-ovRV22bA8VPQjaBVTHJj1lLlL2Wv4Wt1r7GfLWo1n3WiKXOlbdv9jMsctM-XgZYfCZ9GDU",
    "privateKey":"9w1B3Xs4wlXJFZByV-WNPb61Gp2uPvVXrDwZ8xXmB9A"
};
 
webPush.setVapidDetails(
   'mailto:mohammaddenny94@gmail.com',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/d36qd9XLP0U:APA91bFGvnblHvR8iNaQ-2nJyPMWP5F8sHj4qhl8udLcDJg7lk8JVUL_TPFTfE5gp_T56wl6C6tL5qvBSMr6sR66kUafHKGpQmnUUAzF_kOgo9mDozdcAo_jhRfcTZJrz_70w01kE492",
   "keys": {
       "p256dh": "BCW6aQLnCUbF96VM+dlujYhF7rqjDWA1SRoMgsBHL7tpzttk5jFVpV8sETuMJ5/fOdSmtmEcW3XV0WrnKZi5/wA=",
       "auth": "UF8uH43IfIS0uwcF73zwrA=="
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
   gcmAPIKey: '646651561399',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);