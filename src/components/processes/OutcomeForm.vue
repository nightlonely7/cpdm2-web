<template>
    <v-form ref="form"
            lazy-validation>
        <v-dialog v-model="dialog" persistent transition="dialog-bottom-transition" lazy
                  max-width="600">
            <template #activator="{on}">
                <slot name="activator" :on="on"></slot>
            </template>
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon @click="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Thêm bước vòng</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-text-field
                                        :key="`${step.temporaryId}_name`"
                                        label="Tên bước vòng"
                                        v-model="newOutcome.name"
                                        :rules="[rules.required,rules.length(50)]"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-textarea
                                        class="mb-5"
                                        label="Mô tả"
                                        v-model="newOutcome.description"
                                        counter="255"
                                        :rules="[rules.required, rules.length(255)]"
                                ></v-textarea>
                            </v-flex>
                            <v-flex xs12>
                                <v-select
                                        v-model="newOutcome.nextStepTemporaryId"
                                        :items="tmpSteps"
                                        item-text="name"
                                        item-value="temporaryId"
                                        box
                                        label="Chọn bước"
                                        :rules="[rules.required]"
                                ></v-select>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="dialog = false">Đóng</v-btn>
                    <v-btn color="blue darken-1" flat @click="save">Lưu</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-form>
</template>

<script>
    export default {
        name: "OutcomeForm",
        props: {
            step: Object,
            tmpSteps: Array,
        },
        data() {
            return {
                dialog: false,
                newOutcome: {
                    name: "",
                    description: "",
                    nextStepTemporaryId: 0,
                    lastStep: false,
                    main: false,
                },
                defaultOutcome: {
                    name: "",
                    description: "",
                    nextStepTemporaryId: 0,
                    lastStep: false,
                    main: false,
                },
                rules: {
                    length: len => v => (v || '').length <= len || `Nội dung tối đa ${len} kí tự`,
                    required: v => !!v || 'Nội dung không được để trống'
                }
            }
        },
        methods: {
            save() {
                if(this.$refs.form.validate()){
                    this.step.outcomes.push(Object.assign({}, this.newOutcome));
                    Object.assign(this.newOutcome, this.defaultOutcome);
                    this.dialog = false;
                    this.$refs.form.reset();
                }
            }
        }
    }
</script>

<style scoped>

</style>