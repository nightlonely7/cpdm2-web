<template>
    <v-dialog v-model="dialog" persistent width="500px">
        <template #activator="{on}">
            <slot name="activator" :on="on"></slot>
        </template>
        <v-card v-if="loaded">
            <v-toolbar dark color="primary">
                <v-btn icon @click="dialog = false">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>
                    Tạo mới người dùng
                </v-toolbar-title>
            </v-toolbar>

            <v-card-text>
                <v-container>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-text-field
                                    label="Tên đăng nhập"
                                    v-model="formData.username"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    label="Mật khẩu"
                                    v-model="formData.password"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    label="Chức danh"
                                    v-model="formData.processRole"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-layout row justify-space-around>
                    <v-flex md4 xs6>
                        <v-btn color="secondary" @click="close" block>
                            <v-icon left>clear</v-icon>
                            Hủy
                        </v-btn>
                    </v-flex>
                    <v-flex md4 xs6>
                        <v-btn color="primary" @click="save" block :loading="loading">
                            <v-icon left>done</v-icon>
                            Lưu
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import Axios from 'axios';

    export default {
        name: "UserForm",
        props: {
            id: Number,
        },
        data() {
            return {
                formData: {username: null, password: null, processRole: null},
                loaded: false,
                loading: false,
                dialog: false,
            }
        },
        mounted(){
            this.$nextTick(() => {
                this.getUserDetail();
            })
        },
        methods: {
            close() {
                this.dialog = false;
            },
            save() {
                this.loading = true;
                const url = `http://localhost:8080/users`;
                const method = 'POST';
                const data = this.formData;
                Axios({url, method, data})
                    .then(response => {
                        this.close();
                        this.$emit('refresh', response.data.id);
                        this.$emit('popup',true);
                    })
                    .catch(error => {
                        console.log(error);
                        this.$emit('popup',false);
                    })
                    .finally(() => {
                        this.loading = false;
                    })
            },
            getUserDetail() {
                Axios.get(`http://localhost:8080/users/${this.id}`)
                    .then(response => {
                        this.formData = response.data;
                    })
                    .catch(error => {
                        if (error.response)
                            console.log(error.response);
                    })
            }
        },
        watch: {
            dialog(val) {
                if (val && !this.loaded) {
                    this.loaded = true;
                }
            }
        }
    }
</script>

<style scoped>

</style>