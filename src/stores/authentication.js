import axios from "axios";
import {mes, db} from "@/firebase.js";

var firebaseToken = null;
export default {
    namespaced: true,
    state: {
        status: '',
        token: localStorage.getItem('cpdm_token') || '',
        username: '',
        role: '',
    },
    mutations: {
        REQUEST(state) {
            state.status = 'loading';
        },
        SUCCESS(state, token) {
            state.status = 'success';
            state.token = token;
        },
        ERROR(state) {
            state.status = 'error';
        },
        LOGOUT(state) {
            state.status = '';
            state.token = '';
            state.username = '';
            state.role = '';
        },
        INIT(state, {username, role}) {
            state.status = 'success';
            state.username = username;
            state.role = role;
        }
    },
    getters: {
        isLoggedIn: state => !!state.token,
        isInit: state => !!state.username && !!state.role,
        isAdmin: state => state.role === 'ADMIN',
        isManager: state => state.role === 'MANAGER',
        isStaff: state => state.role === 'STAFF',
        isArchivist: state => state.role === 'ARCHIVIST',
        username: state => state.username
    },
    actions: {
        LOGIN({commit}, user) {
            return new Promise((resolve, reject) => {
                commit('REQUEST');
                axios({url: 'http://localhost:8080/login', data: user, method: 'POST'})
                    .then(response => {
                        const token = response.data.token;
                        localStorage.setItem('cpdm_token', token);
                        commit('SUCCESS', token);
                        console.log('login success');
                        resolve(response);
                    })
                    .catch(error => {
                        commit('ERROR');
                        localStorage.removeItem('cpdm_token');
                        reject(error);
                    })
            })
        },
        LOGOUT({commit}) {
            return new Promise((resolve) => {
                var username = this.state.AUTHENTICATION_STORE.username;
                db.ref('users/' + username).once('value').then(function (snapshot) {
                    var list = [];
                    if (snapshot.val() != null) {
                        list = snapshot.val();
                    }

                    for (var i in list) {
                        if (list[i] === firebaseToken) {
                            console.log(i);
                            list.splice(i, 1);
                            db.ref("users/" + username).set(list);
                            break;
                        }
                    }
                });
                mes.deleteToken(firebaseToken).then(() => console.log('firebase token deleted'));
                commit('LOGOUT');
                localStorage.removeItem('cpdm_token');
                resolve()
            })
        },
        INIT({commit}) {
            return new Promise((resolve, reject) => {
                commit('REQUEST');
                axios({url: 'http://localhost:8080/self', method: 'GET'})
                    .then(response => {
                        const username = response.data.username;
                        const role = response.data.role.name.replace('ROLE_', '');
                        console.log(username, role);
                        commit('INIT', {username, role});

                        mes.requestPermission().then(function () {
                            console.log("Granted");
                            mes.getToken().then(function (token) {
                                console.log(token);
                                firebaseToken = token;
                                db.ref('users/' + username).once('value').then(function (snapshot) {
                                    var list = [];
                                    if (snapshot.val() != null) {
                                        list = snapshot.val();
                                    }
                                    var checked = true;
                                    for (var i in list) {
                                        if (list[i] === token) {
                                            checked = false;
                                        }
                                    }
                                    if (checked) {
                                        list.push(token);
                                    }
                                    db.ref("users/" + username).set(list)
                                        // .then(() => resolve(response)
                                        .then();
                                });
                            }).catch((error) =>
                                console.log("Get token fail " + error)
                            );
                        }).catch(() =>
                            console.log("Grant fail")
                        );
                        resolve(response);
                    })
                    .catch(error => {
                        commit('ERROR');
                        reject(error);
                    })
            })
        }
    }
};