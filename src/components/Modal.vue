<template>
  <dialog ref="dialog" class="modal">
    <button @click="close" class="close-button">X</button>
    <div class="modal-header">
      <h3>Add New Word</h3>
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
.modal-header
  display: flex
  justify-content: center
  align-items: center
  border-bottom: 1px solid #eee
  padding-bottom: 10px
  margin-bottom: 15px

.close-button
  background: none
  border: none
  font-size: 20px
  cursor: pointer
  color: #333
  display: flex

  &:hover
    color: lightskyblue

.modal-footer
  button
    padding: 8px 12px
    border-radius: 50%
    border: none
    cursor: pointer

    &:hover
      background-color: gray
</style>

