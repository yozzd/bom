<template>
  <div class="editor">
    <div v-if="editor" class="editor__header">
      <el-button
        type="primary"
        :class="{ 'editor__menu-item': true, active: editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <client-only>
          <v-icon name="ri-bold" />
        </client-only>
      </el-button>
      <el-button
        :class="{ 'editor__menu-item': true, active: editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <client-only>
          <v-icon name="ri-italic" />
        </client-only>
      </el-button>
    </div>

    <div class="editor__content">
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2';
import StarterKit from '@tiptap/starter-kit';

export default {
  components: {
    EditorContent,
  },

  props: {
    value: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      editor: null,
    };
  },

  watch: {
    value(value) {
      const isSame = this.editor.getHTML() === value;

      if (isSame) {
        return;
      }

      this.editor.commands.setContent(value, false);
    },
  },

  mounted() {
    this.editor = new Editor({
      content: this.value,
      extensions: [
        StarterKit,
      ],
      onUpdate: () => {
        this.$emit('input', this.editor.getHTML());
      },
    });
  },

  beforeDestroy() {
    this.editor.destroy();
  },
};
</script>

<style>
.editor {
  @apply flex flex-col border border-gray-200;
  @apply bg-white rounded-lg;
}
.editor__header {
  @apply flex flex-wrap space-x-1 p-2;
  @apply items-center border-b border-gray-200;
}

.editor__content {
  @apply flex-auto h-48 p-2;
  @apply overflow-x-hidden overflow-y-auto;
}

.editor__footer {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  border-top: 3px solid #0D0D0D;
  font-size: 12px;
  font-weight: 600;
  color: #0d0d0d;
  white-space: nowrap;
  padding: 0.25rem 0.75rem;
}

.editor__menu-item {
  width: 1.75rem;
  height: 1.75rem;
  color: #0d0d0d;
  border: none;
  background-color: transparent;
  border-radius: 0.4rem;
  padding: 0.25rem;
  margin-right: 0.25rem;
  font-weight: bold;
  cursor: pointer;
}

.editor__menu-item.active,
.editor__menu-item:hover {
  color: #fff;
  background-color: #0d0d0d;
}
.editor__content :focus-visible {
  outline: none;
}
</style>
