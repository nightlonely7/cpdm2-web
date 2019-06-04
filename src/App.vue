<template>
    <v-app>
        <router-view :key="$route.fullPath"/>
        <!--Vue-notification-->
        <notifications group="foo" position="bottom right">
            <template slot="body" slot-scope="props">
                <router-link :to="props.item.data.url">
                    <div style="background-color: yellow" @click="to(props.item)">
                        <a class="body-1 font-weight-bold" v-html="props.item.title"/>
                        <br/>
                        <a class="caption" v-html="props.item.text"/>
                    </div>
                </router-link>
            </template>
        </notifications>
    </v-app>
</template>
<style>

</style>
