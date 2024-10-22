<template>
  <dialog ref="dialog" class="modal">
    <div class="modal-header">
      <h3>Add New Word</h3>
      <button @click="close" class="close-button">X</button>
    </div>
    <slot></slot>
  </dialog>
</template>

<script>
export default {
  methods: {
    open() {
      this.$refs.dialog.showModal();
    },
    close() {
      this.$refs.dialog.close();
    }
  }
};
</script>

<style lang="sass" scoped>
.modal
  padding: 20px
  border-radius: 5px
  background-color: white
  width: 400px
  border: none
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2)
  position: relative

.modal-header
  display: flex
  justify-content: space-between
  align-items: center

.close-button
  background: none
  border: none
  font-size: 20px
  cursor: pointer
