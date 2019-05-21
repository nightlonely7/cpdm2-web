<template>
    <DefaultLayout title="Chi tiết văn bản">
        <DocumentDetail :id="id"></DocumentDetail>
    </DefaultLayout>
</template>

<script>
    import DocumentDetail from "../components/documents/DocumentDetail";
    import DefaultLayout from "../layouts/DefaultLayout";
    export default {
        name: "DocumentDetailPage",
        components: {DefaultLayout, DocumentDetail},
        data(){
            return {
                id: Number.parseInt(this.$route.params.id),
            }
        },
    }
</script>

<style scoped>

</style>