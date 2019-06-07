<template>
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title>
                <v-icon left>timeline</v-icon>
                QUẢN LÝ PHÒNG BAN
            </v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh">
                <v-icon left>mdi-refresh</v-icon>
                Tải lại
            </v-btn>
            <v-spacer></v-spacer>
            <DepartmentForm @refresh="refresh" @popup="popup" creating>
                <template #activator="{on}">
                    <v-btn v-on="on" color="primary">
                        <v-icon left>add</v-icon>
                        Tạo mới phòng ban
                    </v-btn>
                </template>
            </DepartmentForm>
        </v-toolbar>
        <v-data-table
                :items="departments"
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
                <td class="text-xs-left">{{item.code}}</td>
                <td class="text-xs-left">{{item.name}}</td>
                <td class="text-xs-left" v-if="item.description === null">{{item.description}}</td>
                <td class="text-xs-left" v-if="item.description !== null">{{item.description | truncate(30)}}</td>
                <td class="text-xs-left">
                    <v-chip color="success" v-if="item.available">
                        Đang hoạt động
                    </v-chip>
                    <v-chip color="error" v-if="!item.available">
                        Ngưng hoạt động
                    </v-chip>
                </td>
                <td class="text-xs-left">
                    <DepartmentForm @refresh="refresh" @popup="popup" :id="item.id">
                        <template #activator="{on}">
                            <v-btn outline flat fab small v-on="on" color="primary">
                                <v-icon>edit</v-icon>
                            </v-btn>
                        </template>
                    </DepartmentForm>
                    <v-btn outline flat fab small @click="deactive(item.id)" color="error" v-if="item.available">
                        <v-icon>delete</v-icon>
                    </v-btn>
                    <v-btn outline flat fab small @click="active(item.id)" color="success" v-if="!item.available">
                        <v-icon>check</v-icon>
                    </v-btn>
                    <v-btn outline flat fab small @click="$router.push(`/departments/${item.id}`)" color="indigo">
                        <v-icon>info</v-icon>
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
    import DepartmentForm from "./DepartmentForm";

    export default {
        name: "DepartmentTable",
        components: {DepartmentForm},
        data() {
            return {
                departments: [],
                loading: false,
                headers: [
                    {text: 'Mã phòng ban', value: ''},
                    {text: 'Tên phòng ban', value: 'name'},
                    {text: 'Mô tả', value: 'description'},
                    {text: 'Trạng thái', value: 'available'},
                    {text: 'Thao tác', sortable: false},
                ],
                pagination: {
                    sortBy: 'available',
                    descending: true
                },
                snackbar: false,
                snackbarText: null,
            }
        },
        methods: {
            refresh() {
                this.getDepartments();
            },
            popup(data){
              if(data === true){
                  this.snackbarText = "Thành công";
                  this.snackbar = true;
              } else{
                  this.snackbarText = "Thất bại";
                  if(data.response.data.message){
                      this.snackbarText = data.response.data.message;
                  }
                  this.snackbar = true;
              }
            },
            getDepartments() {
                this.loading = true;
                Axios.get(`http://localhost:8080/departments`)
                    .then(response => {
                        this.departments = response.data.content;
                    })
                    .catch(console.error)
                    .finally(() => {
                        this.loading = false;
                    })
            },
            deactive(id) {
                if (confirm("Bạn muốn ngưng hoạt động phòng ban này?")) {
                    this.loading = true;
                    Axios.put(`http://localhost:8080/departments/${id}`,{
                        available: false
                    })
                        .then(response => {
                            this.getDepartments();
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
                if (confirm("Bạn muốn tái hoạt động phòng ban này?")) {
                    this.loading = true;
                    Axios.put(`http://localhost:8080/departments/${id}`,{
                        available: true
                    })
                        .then(response => {
                            this.getDepartments();
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
                this.getDepartments();
            }
        }
    }
</script>

<style scoped>

</style>