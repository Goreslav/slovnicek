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
.modal-container
  position: fixed
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  background-color: white
  padding: 20px
  border-radius: 8px
  z-index: 1001
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1)

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
</style>