import { shallowMount } from '@vue/test-utils';
import WordList from "@/components/WordList.vue";

describe('WordList.vue', () => {
    it('should add a word to the list', async () => {
        const wrapper = shallowMount(WordList);

        // Simulujeme vstup pre nové slovo
        wrapper.setData({
            newWord: { word: 'test', translation: 'test translation', description: 'test description' }
        });

        // Simulujeme odoslanie formulára
        await wrapper.find('form').trigger('submit.prevent');

        // Očakávame, že sa nové slovo pridá do zoznamu
        expect(wrapper.vm.words.length).toBe(1);
        expect(wrapper.vm.words[0].word).toBe('test');
    });

    it('should remove a word from the list', async () => {
        const wrapper = shallowMount(WordList);

        // Pridáme slovo na začiatku, aby sme mali čo mazať
        wrapper.setData({
            words: [{ id: 1, word: 'test', translation: 'test translation', description: 'test description' }]
        });

        // Simulujeme kliknutie na tlačidlo "X" na odstránenie slova
        await wrapper.find('button').trigger('click');

        // Očakávame, že zoznam je prázdny po odstránení slova
        expect(wrapper.vm.words.length).toBe(0);
    });
});
