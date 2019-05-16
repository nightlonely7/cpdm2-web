<template>
        <v-content>
            <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md4>
                        <v-form @submit.prevent="login" mx-auto>
                            <v-card class="elevation-12">
                                <v-toolbar dark color="primary">
                                    <v-toolbar-title>Khung đăng nhập</v-toolbar-title>
                                </v-toolbar>
                                <v-card-text>
                                    <v-text-field prepend-icon="person" v-model="username" type="email"
                                                  label="Tên người dùng"></v-text-field>
                                    <v-text-field prepend-icon="lock" v-model="password" type="password"
                                                  label="Mật khẩu"></v-text-field>
                                    <v-alert v-model="alert" dismissible transition="scale-transition">
                                        Đăng nhập thất bại
                                    </v-alert>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn type="submit" color="primary" :loading="loading">Đăng nhập</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-form>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: "LoginPage",
        data() {
            return {
                username: '',
                password: '',
                alert: false
            }
        },
        computed: {
            ...mapState('AUTHENTICATION_STORE', {
                loading: state => state.status === 'loading',
            })
        },
        methods: {
            login: function () {
                this.alert = false;
                const username = this.username;
                const password = this.password;
                this.$store.dispatch('AUTHENTICATION_STORE/LOGIN', {username, password})
                    .then(() => {
                        this.$store.dispatch('AUTHENTICATION_STORE/INIT')
                            .then(() => this.$router.push('/'))
                            .catch(() => this.$router.push('/login'));
                    })
                    .catch(() => this.alert = true);
            }
        },
    }
</script>

<style scoped>
    div {
        margin: auto;
    }
</style>