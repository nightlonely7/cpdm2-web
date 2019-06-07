<template>
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title>
                <v-icon left>mdi-account</v-icon>
                QUẢN LÝ NGƯỜI DÙNG
            </v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="refresh">
                <v-icon left>mdi-refresh</v-icon>
                Tải lại
            </v-btn>
            <UserForm @refresh="refresh" @popup="popup" v-if="isManager">
                <template #activator="{on}">
                    <v-btn v-on="on" color="primary">
                        <v-icon left>add</v-icon>
                        Tạo mới người dùng
                    </v-btn>
                </template>
            </UserForm>
        </v-toolbar>
        <v-data-table
                :items="users"
                :headers="headers"
                :loading="loading"
                :pagination.sync="pagination"
                :total-items="pagination.totalItems"
                :rows-per-page-text="'Số hàng mỗi trang'"
                :rows-per-page-items="[10, 25, 50, {text: 'Tất cả', value: -1}]"
                :no-data-text="'Không có dữ liệu'"
                :no-results-text="'Không tìm thấy dữ liệu tương ứng'"
                :must-sort="true"
        >

            <template #pageText="{pageStart, pageStop, itemsLength}">
                {{pageStart}} - {{pageStop}} của tổng cộng {{itemsLength}}
            </template>

            <template #items="{item}">
                <td class="text-xs-left">{{item.username}}</td>
                <td class="text-xs-left">{{item.department.name}}</td>
                <td class="text-xs-left">{{item.processRole}}</td>
                <td class="text-xs-left" v-if="isAdmin">
                    <v-chip color="success" v-if="item.available">
                        Kích hoạt
                    </v-chip>
                    <v-chip color="error" v-if="!item.available">
                        Vô hiệu hoá
                    </v-chip>
                </td>
                <td class="text-xs-left"  v-if="isAdmin">
                    <v-btn outline flat fab small @click="deactive(item.id)" color="error" v-if="item.available">
                        <v-icon>delete</v-icon>
                    </v-btn>
                    <v-btn outline flat fab small @click="active(item.id)" color="success" v-if="!item.available">
                        <v-icon>check</v-icon>
                    </v-btn>
                </td>
            </template>
        </v-data-table>

        <!--Snack bar-->
        <v-snackbar v-model="snackbar" right>
            {{snackbarText}}
            <v-btn
                    color="pink"
                    flat
                    @click="snackbar = false"
            >
                Close
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import Axios from 'axios';
    import {mapGetters} from 'vuex';
    import UserForm from "./UserForm";
    export default {
        name: "UserTable",
        components: {UserForm},
        data() {
            return {
                users: [],
                loading: false,
                headers: [
                    {text: 'Tên người dùng', value: 'username'},
                    {text: 'Tên phòng ban', value: 'department.name'},
                    {text: 'Chức danh', value: 'processRole'},
                ],
                pagination: {
                    sortBy: 'available',
                    descending: true
                },
                snackbar: false,
                snackbarText: null,
            }
        },
        mounted() {
            this.$nextTick(() => {
                if(this.isAdmin){
                    this.headers.push({text: 'Trạng thái', value: 'available'});
                    this.headers.push({text: 'Thao tác', sortable: false});
                    console.log(this.headers);
                }
            })
        },
        methods: {
            refresh() {
                this.getUsers();
            },
            popup(data){
                if(data === true){
                    this.snackbarText = "Thành công";
                    this.snackbar = true;
                } else{
                    this.snackbarText = "Tên đăng nhập đã tồn tại";
                    // if(data.response.data.message){
                    //     this.snackbarText = data.response.data.message;
                    // }
                    this.snackbar = true;
                }
            },
            getUsers() {
                this.loading = true;
                var url = `http://localhost:8080/users/search/findAllStaffForManager`;
                if(this.isAdmin){
                    var url = `http://localhost:8080/users/search/findAllUserForDirector`;
                }
                Axios.get(url)
                    .then(response => {
                        console.log(response.data.content);
                        this.users = response.data.content;
                    })
                    .catch(console.error)
                    .finally(() => {
                        this.loading = false;
                    })
            },
            deactive(id) {
                if (confirm("Bạn muốn vô hiệu hoá tài khoản này?")) {
                    this.loading = true;
                    Axios.put(`http://localhost:8080/users/${id}/deactive`)
                        .then(response => {
                            this.getUsers();
                            this.snackbarText = "Thành công";
                            this.snackbar = true;
                        })
                        .catch(error => {
                            console.log(error);
                            this.snackbarText = "Thất bại";
                            if(error.response.data.message){
                                this.snackbarText = error.response.data.message;
                            }
                            this.snackbar = true;
                        })
                        .finally(() => {
                            this.loading = false;
                        })
                }
            },
            active(id){
                if (confirm("Bạn muốn tái kích hoạt tài khoản này?")) {
                    this.loading = true;
                    Axios.put(`http://localhost:8080/users/${id}/active`)
                        .then(response => {
                            this.getUsers();
                            this.snackbarText = "Thành công";
                            this.snackbar = true;
                        })
                        .catch(error => {
                            console.log(error);
                            this.snackbarText = "Thất bại";
                            if(error.response.data.message){
                                this.snackbarText = error.response.data.message;
                            }
                            this.snackbar = true;
                        })
                        .finally(() => {
                            this.loading = false;
                        })
                }
            }
        },
        watch: {
            pagination() {
                this.getUsers();
            }
        },
        computed: {
            ...mapGetters('AUTHENTICATION_STORE', {
                username: 'username',
                isAdmin: 'isAdmin',
                isManager: 'isManager'
            }),
        },
    }
</script>

<style scoped>

</style>