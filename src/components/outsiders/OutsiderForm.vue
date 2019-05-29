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
                    {{creating ? 'Tạo mới nơi ban hành' : 'Chỉnh sửa nơi ban hành'}}
                </v-toolbar-title>
            </v-toolbar>

            <v-card-text>
                <v-container>
                    <v-layout wrap>

                        <v-flex xs12>
                            <v-text-field
                                    label="Số hiệu nơi ban hành"
                                    v-model="formData.code"
                            ></v-text-field>
                        </v-flex>

                        <v-flex xs12>
                            <v-text-field
                                    label="Tên nơi ban hành"
                                    v-model="formData.name"
                            ></v-text-field>
                        </v-flex>

                        <v-flex xs12>
                            <v-textarea
                                    label="Thông tin liên lạc"
                                    v-model="formData.contactData"
                            ></v-textarea>
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
    import Axios from 'axios'

    export default {
        name: "OutsiderForm",
        props: {
            id: Number,
            creating: Boolean,
        },
        data() {
            return {
                formData: {name: null, code: null, contactData: null},
                loaded: false,
                loading: false,
                dialog: false,
            }
        },
        methods: {
            close() {
                this.dialog = false;
            },
            save() {
                this.loading = true;
                const url = this.creating ?
                    `http://localhost:8080/outsiders` :
                    `http://localhost:8080/outsiders/${this.formData.id}`;
                const method = this.creating ? 'POST' : 'PUT';
                const data = this.formData;
                Axios({url, method, data})
                    .then(response => {
                        this.close();
                        this.$emit('refresh', response.data.id);
                    })
                    .catch(error => {
                        if (error.response)
                            console.log(error.response);
                    })
                    .finally(() => {
                        this.loading = false;
                    })
            },
            getOutsiderDetail() {
                Axios.get(`http://localhost:8080/outsiders/${this.id}`)
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
            },
            id(val) {
                if (val) {
                    this.getOutsiderDetail();
                }
            }
        }
    }
</script>

<style scoped>

</style>