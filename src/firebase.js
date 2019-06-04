import firebase from 'firebase/app';
import 'firebase/messaging';
import 'firebase/database';
import Axios from 'axios';
import Vue from 'vue';

var config = {
    apiKey: "AIzaSyCRZo5TR0UxVsuiUpkgAJm7Batq_S3SQHk",
    authDomain: "cpdm-notification.firebaseapp.com",
    databaseURL: "https://cpdm-notification.firebaseio.com",
    projectId: "cpdm-notification",
    storageBucket: "cpdm-notification.appspot.com",
    messagingSenderId: "192613208670"
};
firebase.initializeApp(config);
const database = firebase.database();
const messaging = firebase.messaging();
messaging.usePublicVapidKey('BCasv1NftCLiF1rXwWD13MQ_yeeiozIQ3r7NMt0HJnumsGpiZTLbIoVg8-b5GA5qcA6Wx7j9Y1evudFdZi100sY');
messaging.onMessage(function (payload) {
    Vue.notify({
        group: 'foo',
        title: payload.notification.title,
        text: payload.notification.body,
        data: {
            url: payload.data.url
        },
    });
});

export function pushNotif(title, detail, url, user) {
    var keys = [];
    db.ref('users/' + user.id).once('value').then(function (snapshot) {
        if (snapshot.val() != null) {
            keys = snapshot.val();
        }
        if(keys.length > 0){
            var message = {
                "title": title,
                "detail": detail,
                "url": url
            };
            for (var i in keys) {
                Axios.post(`https://fcm.googleapis.com/fcm/send"`,
                    {
                        "data":message,
                        'notification': message,
                        'to': keys[i]
                    },
                    {
                        headers: {
                            'Authorization': 'key=AAAALNikUl4:APA91bEC0s3Ua-44isrp19yL_k4XeORndrVawsqnwrTylsVXAe9NUA0yMkMEk0FXN9Oi7EY98D3j8PwSt_LQU4PQWbGM_qskrXofxBINJtD3L5Sd71ucGjoxkP1Lr4sbAsHsemeQ8Ekr',
                            'Content-Type': 'application/json'
                        }
                    })
            }
        }
    })
}

export const mes = messaging;
export const db = database;
