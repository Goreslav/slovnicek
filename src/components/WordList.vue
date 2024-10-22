<template>
  <div>
    <button v-once class="add-word-btn" @click="openModal">Add New Word</button>
    <Modal ref="wordModal">
      <form @submit.prevent="addWord">
        <input v-model="newWord.word" placeholder="Enter a new word" />
        <input v-model="newWord.translation" placeholder="Enter a translation" />
        <input v-model="newWord.description" placeholder="Enter a description" />
        <button type="submit">Add Word</button>
      </form>
    </Modal>

    <div class="word-list-container">
      <RecycleScroller
          class="scroller"
          :items="words"
          :item-size="80"
          :buffer="200"
          :prerender="10"
          key-field="id"
          v-slot="{ item, index }"
      >
        <div
            class="word-item"
            draggable="true"
            @dragstart="onDragStart(index)"
            @dragover.prevent
            @drop="onDrop(index)"
        >
          <div>
            <strong>{{ item.word }}</strong> - {{ item.translation }} <br />
            <small>{{ item.description }}</small>
          </div>
          <button @click="confirmDelete(index)">X</button>
        </div>
      </RecycleScroller>
    </div>

    <footer class="footer">
      <p>© 2024 My Word List App</p>
    </footer>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { fetchWords, addWord, removeWord } from '@/services/api';
import { throttle } from 'lodash';
import { RecycleScroller } from 'vue-virtual-scroller';
const Modal = () => import('@/components/Modal.vue');
export default {
  components: {
    Modal,
    RecycleScroller
  },
  data() {
    return {
      words: [],
      newWord: {
        word: "",
        translation: "",
        description: ""
      },
      draggedIndex: null
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
              this.newWord = { word: "", translation: "", description: "" };
              this.saveWords();
              this.$refs.wordModal.close();
            })
            .catch(error => {
              // console.error('Error adding word:', error);
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
            Swal.fire('Deleted!', 'The word has been deleted.', 'success');
          })
          .catch(error => {
            // console.error('Error removing word:', error);
          });
    },
    saveWords: throttle(function() {
      localStorage.setItem('words', JSON.stringify(this.words));
    }, 1000),

    onDragStart(index) {
      this.draggedIndex = index;
    },
    onDrop(index) {
      const draggedWord = this.words[this.draggedIndex];
      this.words.splice(this.draggedIndex, 1);
      this.words.splice(index, 0, draggedWord);
      this.saveWords();
    }
  },
  created() {
    fetchWords()
        .then(response => {
          this.words = response.data;
          this.saveWords();
        })
        .catch(error => {
          // console.error('Error fetching words:', error);
        });
  }
};
</script>

<!-- Upravené štýly -->
<style scoped>
/* Fixované tlačidlo pre pridanie nového slova */
.add-word-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1000;
}

.add-word-btn:hover {
  background-color: #0056b3;
}

/* Kontejner pre word-list s dynamickou výškou, minus výška tlačidla a footeru */
.word-list-container {
  padding: 20px;
  height: calc(100vh - 60px - 50px); /* Výška obrazovky - výška tlačidla (60px) - výška footeru (50px) */
  overflow-y: auto;
}

.scroller {
  height: 100%; /* Nastavenie plnej výšky pre skrolovač */
}

/* Štýl pre jednotlivé slová s medzerami medzi nimi */
.word-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  cursor: move;
  margin-bottom: 10px; /* Pridanie medzery medzi položkami */
}

/* Štýly pre tlačidlo */
button {
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

/* Generický footer */
.footer {
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px; /* Pevná výška footeru */
}

</style>
