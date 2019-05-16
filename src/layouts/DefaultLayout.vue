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
                <v-list-tile to="/">
                    <v-list-tile-action>
                        <v-icon>mdi-home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Home</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile to="/about">
                    <v-list-tile-action>
                        <v-icon>mdi-home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>About</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile to="/documents">
                    <v-list-tile-action>
                        <v-icon>mdi-home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Quản lý văn bản</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar dark fixed app color="primary">
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>{{title}}</v-toolbar-title>
            <v-spacer/>
            <span>{{username}}&nbsp; &nbsp; &nbsp;</span>
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
        computed: {
            ...mapGetters('AUTHENTICATION_STORE', {
                username: 'username',
            }),
        },
    }
</script>

<style scoped>

</style>