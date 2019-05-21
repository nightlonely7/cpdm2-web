<template>
    <div>
        <table rules="all" width="100%">
            <tr>
                <td>aaaaaaaaaaaa</td>
                <td>bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb</td>
            </tr>
            <tr>
                <td>a</td>
                <td colspan="2">b</td>
            </tr>
            <tr>
                <td>a</td>
                <td colspan="2">b</td>
            </tr>
            <tr>
                <td>a</td>
                <td colspan="2">b</td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: "DocumentDetail",
        props: {
            id: Number,
        },
        methods: {
            getDocumentDetail() {
                console.log(this.id);
            },
        },
        mounted() {
            this.$nextTick(() => {
                this.getDocumentDetail();
            });
        }
    }
</script>

<style scoped>

</style>