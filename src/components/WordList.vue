<template>
  <div>
    <button @click="openModal">Add New Word</button>
    <Modal ref="wordModal">
      <form @submit.prevent="addWord">
        <input v-model="newWord.word" placeholder="Enter a new word" />
        <input v-model="newWord.translation" placeholder="Enter a translation" />
        <input v-model="newWord.description" placeholder="Enter a description" />
        <button type="submit">Add Word</button>
      </form>
    </Modal>

    <div class="word-list">
      <div v-for="(word, index) in words" :key="word.id" class="word-item">
        <div>
          <strong>{{ word.word }}</strong> - {{ word.translation }} <br />
          <small>{{ word.description }}</small>
        </div>
        <button @click="confirmDelete(index)">X</button>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from '@/components/Modal.vue';
import Swal from 'sweetalert2';
import { fetchWords, addWord, removeWord } from '@/services/api';

export default {
  components: {
    Modal
  },
  data() {
    return {
      words: [],
      newWord: {
        word: "",
        translation: "",
        description: ""
      }
    };
  },
  methods: {
    openModal() {
      this.$refs.wordModal.open();
    },
    addWord() {
      if (this.newWord.word.trim() && this.newWord.translation.trim()) {
        const newWordObject = {
          word: this.newWord.word,
          translation: this.newWord.translation,
          description: this.newWord.description || ""
        };

        addWord(newWordObject)
            .then(response => {
              newWordObject.id = response.data.id;
              this.words.push(newWordObject);
              this.newWord = {word: "", translation: "", description: ""};
              this.saveWords();
              this.$refs.wordModal.close();
            })
            .catch(error => {
              console.error('Error adding word:', error);
            });
      }
    },
    confirmDelete(index) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to delete this word?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.removeWord(index);
        }
      });
    },
    removeWord(index) {
      const wordToRemove = this.words[index];
      removeWord(wordToRemove.id)
          .then(() => {
            this.words.splice(index, 1);
            this.saveWords();
            Swal.fire(
                'Deleted!',
                'The word has been deleted.',
                'success'
            );
          })
          .catch(error => {
            console.error('Error removing word:', error);
          });
    },
    saveWords() {
      localStorage.setItem('words', JSON.stringify(this.words));
    }
  },
  created() {
    fetchWords()
        .then(response => {
          this.words = response.data;
          this.saveWords();
        })
        .catch(error => {
          console.error('Error fetching words:', error);
        });
  }
};
</script>

<style lang="sass" scoped>
.word-list
  display: flex
  flex-direction: column
  gap: 10px
  max-height: 80vh
  overflow-y: auto

.word-item
  display: flex
  justify-content: space-between
  padding: 10px
  background-color: #f0f0f0
  border: 1px solid #ccc
  cursor: move

button
  background-color: #007bff
  color: white
  padding: 5px 10px
  border: none
  border-radius: 3px
  cursor: pointer

  &:hover
    background-color: #0056b3
</style>
