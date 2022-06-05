<template>
  <div class="dropzone"
      v-on:click="openFileSelection"
      v-on:dragover="onDragOver"
      v-on:dragleave="onDragLeave"
      v-on:drop="onDrop"
      v-bind:class="{hightlight: hightlight, disabled: !enabled}"
      >
    <div>Agregar archivos</div>
    <input ref="fileInput" accept="application/pdf" class="file-input" type="file" multiple v-on:change="onFileChanged" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
@Component
export default class DropZone extends Vue {
  @Prop({ default: true })
  private enabled!: boolean;
  private hightlight = false;
  openFileSelection() {
    if (!this.enabled) return;
    const element: HTMLElement = this.$refs.fileInput as HTMLElement;
    element.click();
    // (this.$refs.fileInput)?.click();
  }
  onDragOver(event: DragEvent) {
    if (!this.enabled) return;
    event.preventDefault();
    this.hightlight = true;
  }
  onDragLeave(event: DragEvent) {
    this.hightlight = false;
  }
  onDrop(event: DragEvent): void {
    if (!this.enabled) return;
    this.$emit('filesNew');
    event.preventDefault();
    const files = event.dataTransfer!.files;
    const result = [];

    for (let i = 0; i < files.length; i++) {
      // console.log(files.item(i),'de');
      if (files.item(i).type === 'application/pdf')
        result.push(files.item(i));

    }
    //
    this.$emit('filesAdded', result);
    this.hightlight = false;
  }
  onFileChanged(event: any) {
    this.$emit('filesNew');
    const files: FileList = event.target.files;
    const result: File[] = [];
    for (let i = 0; i < files.length; i++) {
      if (files.item(i).type === 'application/pdf') {
        result.push(files.item(i));
      }
    }
    this.$emit('filesAdded', result);
  }
}
</script>

<style scoped>
.dropzone {
  position: relative;
  border: 3px dashed #42b983;
  color: #42b983;
  font: bold 24px/200px arial;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
}
.hightlight {
  background-color: #b3dbc9;
}
.disabled {
  border: 3px dashed grey;
  color: grey;
}
.file-input {
  display: none;
}
</style>
