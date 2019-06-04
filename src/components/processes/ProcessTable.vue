<template>
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title>
                <v-icon left>timeline</v-icon>
                QUẢN LÝ QUY TRÌNH
            </v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh">
                <v-icon left>mdi-refresh</v-icon>
                Tải lại
            </v-btn>
            <v-spacer></v-spacer>
            <router-link to="/processes_creating">
                <v-btn color="primary">
                    <v-icon left>add</v-icon>
                    Tạo mới quy trình
                </v-btn>
            </router-link>
        </v-toolbar>
        <v-data-table
                :items="processes"
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
                    <td class="text-xs-left">{{item.name}}</td>
                    <td class="text-xs-left">{{item.description | truncate(30)}}</td>
                    <td class="text-xs-left">{{moment(item.createdTime).format('DD-MM-YYYY')}}</td>
                    <td>
                        <v-btn outline flat fab small color="indigo" @click="$router.push(`/processes/${item.id}`)">
                            <v-icon>info</v-icon>
                        </v-btn>
                    </td>
            </template>

        </v-data-table>
    </div>
</template>

<script>
    import Axios from 'axios';

    export default {
        name: "ProcessTable",
        data() {
            return {
                processes: [],
                loading: false,
                headers: [
                    {text: 'Tên quy trình', value: 'name'},
                    {text: 'Mô tả', value: 'description'},
                    {text: 'Thời gian tạo', value: 'createdTime'},
                    {text: 'Thao tác', sortable: false},
                ],
                pagination: {
                    sortBy: 'createdTime',
                    descending: true
                },
            }
        },
        methods: {
            refresh() {
                this.getProcesses();
            },
            getProcesses() {
                this.loading = true;
                Axios.get(`http://localhost:8080/document_processes`)
                    .then(response => {
                        this.processes = response.data.content;
                    })
                    .catch(console.error)
                    .finally(() => {
                        this.loading = false;
                    })
            }
        },
        watch: {
            pagination() {
                this.getProcesses();
            }
        }
    }
</script>

<style scoped>

</style>