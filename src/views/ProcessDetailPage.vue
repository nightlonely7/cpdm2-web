<template>
    <DefaultLayout>
        <ProcessDetail :id="id"></ProcessDetail>
    </DefaultLayout>
</template>

<script>
    import DefaultLayout from "../layouts/DefaultLayout";
    import ProcessDetail from "../components/processes/ProcessDetail";
    export default {
        name: "ProcessDetailPage",
        components: {ProcessDetail, DefaultLayout},
        data(){
            return {
                id: Number.parseInt(this.$route.params.id),
            }
        },
    }
</script>

<style scoped>

</style>