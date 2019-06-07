<template>
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title>
                <v-icon left>mdi-home</v-icon>
                CHI TIẾT PHÒNG BAN
            </v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer/>
        </v-toolbar>
        <v-card class="mb-3">
            <v-card-text>
                <v-text-field
                        v-model="department.code"
                        label="Mã quy trình"
                        readonly
                >
                </v-text-field>
                <v-text-field
                        v-model="department.name"
                        label="Tên quy trình"
                        readonly
                >
                </v-text-field>
                <v-textarea
                        class="mb-5"
                        label="Mô tả"
                        v-model="department.description"
                        readonly
                ></v-textarea>
                <v-card>
                    <v-card-title>Quản lý phòng ban</v-card-title>
                    <v-card-text>
                        <v-list-tile>
                            <v-list-tile-action>
                                <v-icon>mdi-account</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title v-text="manager.username"></v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-card-text>
                </v-card>
                <v-card>
                    <v-card-title>Nhân viên phòng ban</v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-tile
                                    v-for="item in staffs"
                                    :key="item.username"
                            >
                                <v-list-tile-action>
                                    <v-icon>mdi-account</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title v-text="item.username"></v-list-tile-title>
                                </v-list-tile-content>
                                <v-spacer/>
                                <v-btn fab small flat @click="promo(item.id)">
                                    <v-icon color="blue">arrow_upward</v-icon>
                                </v-btn>
                            </v-list-tile>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
    import Axios from 'axios';

    export default {
        name: "DepartmentDetail",
        props: {
            id: Number,
        },
        data() {
            return {
                loading: false,
                department: {
                    id: 0,
                    code: null,
                    name: null,
                    description: null,
                },
                staffs: [],
                manager: {}
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.getDepartmentDetail();
                this.getUserForDepartment();
            })
        },
        methods: {
            getDepartmentDetail() {
                this.loading = true;
                Axios.get(`http://localhost:8080/departments/${this.id}`)
                    .then(response => {
                        this.department = response.data;
                    })
                    .catch(console.error)
                    .finally(() => {
                        this.loading = false;
                    })
            },
            getUserForDepartment(){
                this.loading = true;
                Axios.get(`http://localhost:8080/users/search/findAllByDepartmentId/${this.id}`)
                    .then(response => {
                        var users = response.data;
                        var index = 0;
                        for(var i in users){
                            console.log(users[i])
                            if(users[i].role.name === 'ROLE_MANAGER'){
                                this.manager = users[i];
                                index = i;
                            }
                        }
                        this.$delete(users,index);
                        this.staffs = users;
                    })
                    .catch(console.error)
                    .finally(() => {
                        this.loading = false;
                    })
            },
            promo(id){
                this.loading = true;
                Axios.put(`http://localhost:8080/users/promo/${id}/${this.id}`)
                    .then(response => {
                        this.getUserForDepartment();
                    })
                    .catch(console.error)
                    .finally(() => {
                        this.loading = false;
                    })
            }
        }
    }
</script>

<style scoped>

</style>