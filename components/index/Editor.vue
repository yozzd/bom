<template>
  <div class="editor">
    <div v-if="editor" class="editor__header">
      <el-button
        title="Button"
        :class="{ 'editor__menu-item': true, active: editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <client-only>
          <v-icon name="ri-bold" />
        </client-only>
      </el-button>
      <el-button
        title="Italic"
        :class="{ 'editor__menu-item': true, active: editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <client-only>
          <v-icon name="ri-italic" />
        </client-only>
      </el-button>
      <el-button
        title="Underline"
        :class="{ 'editor__menu-item': true, active: editor.isActive('underline') }"
        @click="editor.chain().focus().toggleUnderline().run()"
      >
        <client-only>
          <v-icon name="ri-underline" />
        </client-only>
      </el-button>
      <el-button
        title="Strikethrough"
        :class="{ 'editor__menu-item': true, active: editor.isActive('strike') }"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        <client-only>
          <v-icon name="ri-strikethrough" />
        </client-only>
      </el-button>
      <el-button
        title="Highlight"
        :class="{ 'editor__menu-item': true, active: editor.isActive('highlight') }"
        @click="editor.chain().focus().toggleHighlight().run()"
      >
        <client-only>
          <v-icon name="ri-mark-pen-line" />
        </client-only>
      </el-button>

      <div class="divider"></div>

      <el-button
        title="Align Left"
        :class="{ 'editor__menu-item': true, active: editor.isActive({ textAlign: 'left' }) }"
        @click="editor.chain().focus().setTextAlign('left').run()"
      >
        <client-only>
          <v-icon name="ri-align-left" />
        </client-only>
      </el-button>
      <el-button
        title="Align Center"
        :class="{ 'editor__menu-item': true, active: editor.isActive({ textAlign: 'center' }) }"
        @click="editor.chain().focus().setTextAlign('center').run()"
      >
        <client-only>
          <v-icon name="ri-align-center" />
        </client-only>
      </el-button>
      <el-button
        title="Align Right"
        :class="{ 'editor__menu-item': true, active: editor.isActive({ textAlign: 'right' }) }"
        @click="editor.chain().focus().setTextAlign('right').run()"
      >
        <client-only>
          <v-icon name="ri-align-right" />
        </client-only>
      </el-button>
      <el-button
        title="Align Justify"
        :class="{ 'editor__menu-item': true, active: editor.isActive({ textAlign: 'justify' }) }"
        @click="editor.chain().focus().setTextAlign('justify').run()"
      >
        <client-only>
          <v-icon name="ri-align-justify" />
        </client-only>
      </el-button>

      <div class="divider"></div>

      <el-button
        title="Paragraph"
        :class="{ 'editor__menu-item': true, active: editor.isActive('paragraph') }"
        @click="editor.chain().focus().setParagraph().run()"
      >
        <client-only>
          <v-icon name="ri-paragraph" />
        </client-only>
      </el-button>
      <el-button
        title="Bullet List"
        :class="{ 'editor__menu-item': true, active: editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        <client-only>
          <v-icon name="ri-list-unordered" />
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
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';

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
        Highlight,
        StarterKit,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Underline,
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
  @apply flex flex-wrap p-2 bg-gray-100 rounded-t-lg;
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
  @apply w-7 h-7 cursor-pointer bg-transparent;
  @apply border-0 p-1 -mr-1 rounded;
}

.editor__menu-item.active,
.editor__menu-item:hover {
  @apply bg-gray-200;
}
.editor__content :focus-visible {
  @apply outline-none;
}
.divider {
  @apply ml-3 mr-2 w-0.5 h-5 bg-gray-200;
}
</style>
