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
          ref="scroller"
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
            :class="{ dragging: draggedIndex === index }"
            draggable="true"
            @dragstart="onDragStart(index)"
            @dragover.prevent
            @drop="onDrop(index)"
        >
          <div class="box">
            <strong>{{ item.word }}</strong>
            <i>{{ item.translation }}</i>
            <small>{{ item.description }}</small>
          </div>
          <button @click="confirmDelete(index)">X</button>
        </div>
      </RecycleScroller>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { fetchWords, addWord, removeWord } from '@/services/api';
import { throttle } from 'lodash';
import { RecycleScroller } from 'vue-virtual-scroller';
const Modal = () => import('@/components/Modal.vue');
const Footer = () => import('@/components/Footer.vue');

export default {
  components: {
    Footer,
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
      draggedIndex: null,
      targetIndex: null
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
            .catch();
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
          .catch();
    },
    saveWords() {
      localStorage.setItem('words', JSON.stringify(this.words));
    },

    // Drag and Drop methods
    onDragStart(index) {
      this.draggedIndex = index;

      // Add global event listeners for drag and drop
      window.addEventListener('dragover', this.onDragOver);
      window.addEventListener('drop', this.onDropGlobal);
    },
    onDragOver(event) {
      const scrollerRect = this.$refs.scroller.$el.getBoundingClientRect();
      const relativeY = event.clientY - scrollerRect.top;

      // Calculate approximate target index based on Y position
      const approximateIndex = Math.floor(relativeY / 80); // assuming 80px per item height
      const boundedIndex = Math.max(0, Math.min(this.words.length - 1, approximateIndex));

      this.targetIndex = boundedIndex;
    },
    onDropGlobal(event) {
      if (this.draggedIndex !== null && this.targetIndex !== null) {
        const draggedWord = this.words[this.draggedIndex];
        this.words.splice(this.draggedIndex, 1);
        this.words.splice(this.targetIndex, 0, draggedWord);

        this.saveWordsThrottled();

        // Reset the drag state
        this.draggedIndex = null;
        this.targetIndex = null;
      }

      // Remove global event listeners
      window.removeEventListener('dragover', this.onDragOver);
      window.removeEventListener('drop', this.onDropGlobal);
    },
    onDrop(index) {
      // Standard drop logic when the drop happens within the rendered component
      const draggedWord = this.words[this.draggedIndex];
      this.words.splice(this.draggedIndex, 1);
      this.words.splice(index, 0, draggedWord);

      this.saveWordsThrottled();
    },
    saveWordsThrottled: throttle(function () {
      localStorage.setItem('words', JSON.stringify(this.words));
    }, 1000)
  },
  created() {
    const savedWords = localStorage.getItem('words');

    if (savedWords) {
      this.words = JSON.parse(savedWords);
    } else {
      fetchWords()
          .then(response => {
            this.words = response.data;
            this.saveWords();
          })
          .catch();
    }
  }
};
</script>

<style scoped>
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

.word-list-container {
  padding: 20px;
  height: calc(100vh - 100px - 100px);
  overflow-y: auto;
}

.scroller {
  height: 100%;
}

.word-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  cursor: move;
  margin-bottom: 10px;
}

.word-item.dragging {
  opacity: 0.5;
  border: 2px dashed #007bff;
}

.box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

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
</style>
