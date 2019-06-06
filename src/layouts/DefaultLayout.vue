<template>
    <div>
        <v-btn>aaa</v-btn>
        <v-navigation-drawer fixed app v-model="drawer">
            <v-list>
                <v-list-tile avatar>
                    <v-list-tile-avatar color="white" tile>
                        <img style="width: auto; margin-left: 100%" src='../assets/logo.png' alt="logo">
                    </v-list-tile-avatar>
                    <v-list-tile-title style="margin-left: 20%">
                        SAIGON XUÂN PHÁT
                    </v-list-tile-title>
                    <v-divider></v-divider>
                </v-list-tile>
                <v-list-tile to="/departments" v-if="isAdmin">
                    <v-list-tile-action>
                        <v-icon>mdi-home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Quản lý phòng ban</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-group>
                    <template #activator>
                        <v-list-tile>
                            <v-list-tile-action>
                                <v-icon>assignment_ind</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Quản lí ủy quyền</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                    <v-list-tile to="/documents">
                        <v-list-tile-action>
                            <v-icon></v-icon>
                        </v-list-tile-action>
<!--                        <v-list-tile-action>-->
<!--                            <v-icon>mdi-arrow-collapse-right</v-icon>-->
<!--                        </v-list-tile-action>-->
                        <v-list-tile-content>
                            <v-list-tile-title>Văn bản đến</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-action>
                            <v-icon></v-icon>
                        </v-list-tile-action>
<!--                        <v-list-tile-action>-->
<!--                            <v-icon>mdi-arrow-expand-right</v-icon>-->
<!--                        </v-list-tile-action>-->
                        <v-list-tile-content>
                            <v-list-tile-title>Văn bản đi</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list-group>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon>mdi-home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Văn bản nội bộ</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile to="/processes" v-if="isAdmin">
                    <v-list-tile-action>
                        <v-icon>timeline</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Quản lý quy trình</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar dark fixed app color="primary">
            <v-toolbar-side-icon @click.stop="drawer = !drawer" title="Ẩn/Hiện thanh điều hướng"></v-toolbar-side-icon>
            <v-btn icon title="Quay lại trang" @click="$router.back()">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-toolbar-title>
                {{title}}
            </v-toolbar-title>
            <v-spacer/>
            <span>{{username}}&nbsp; &nbsp; &nbsp;</span>
            <v-btn icon @click="logout">
                <v-icon>mdi-logout</v-icon>
            </v-btn>
        </v-toolbar>
        <v-content>
            <v-container fluid>
                <slot></slot>
            </v-container>
        </v-content>
        <v-footer dark fixed app color="primary">
            <v-spacer></v-spacer>
            <span style="margin-right: 5px">&copy; 2019 by FPTU</span>
        </v-footer>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "DefaultLayout",
        props: {
            title: String,
        },
        data() {
            return {
                drawer: true,
            }
        },
        methods: {
            logout: function () {
                this.$store.dispatch('AUTHENTICATION_STORE/LOGOUT')
                    .then(() => {
                        this.$router.push('/login');
                    });
            },
        },
        computed: {
            ...mapGetters('AUTHENTICATION_STORE', {
                username: 'username',
                isAdmin: 'isAdmin'
            }),
        },
    }
</script>

<style scoped>

</style>