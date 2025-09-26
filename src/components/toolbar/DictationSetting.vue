<script setup lang="ts">
import {Icon} from '@iconify/vue';
import IconWrapper from "@/components/IconWrapper.vue";
import Tooltip from "@/components/Tooltip.vue";
import {useSettingStore} from "@/stores/setting.ts";
import {$ref} from "vue/macros";
import {DictationMode, getDictationDisplayText} from "@/types.ts";
import {onMounted, onUnmounted} from 'vue';

const settingStore = useSettingStore()
let showDropdown = $ref(false)

const dictationModes = [
  {
    value: DictationMode.None,
    label: '不默写',
    icon: 'mdi:eye-outline',
    description: '显示所有字母'
  },
  {
    value: DictationMode.Full,
    label: '全部隐藏',
    icon: 'majesticons:eye-off-line',
    description: '隐藏所有字母'
  },
  {
    value: DictationMode.VowelsOnly,
    label: '隐藏元音',
    icon: 'material-symbols:abc',
    description: '只隐藏元音字母 (a,e,i,o,u)'
  },
  {
    value: DictationMode.ConsonantsOnly,
    label: '隐藏辅音',
    icon: 'material-symbols:abc-outlined',
    description: '只隐藏辅音字母 (除元音外的字母)'
  }
]

const currentMode = $computed(() => {
  return dictationModes.find(mode => mode.value === settingStore.dictation) || dictationModes[0]
})

function selectMode(mode: DictationMode) {
  settingStore.dictation = mode
  showDropdown = false
}

function toggleDropdown() {
  showDropdown = !showDropdown
}

// 点击外部时关闭下拉菜单
function handleClickOutside(e: Event) {
  const target = e.target as HTMLElement
  if (!target.closest('.dictation-setting')) {
    showDropdown = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function getExampleText() {
  return getDictationDisplayText('hello', settingStore.dictation, true)
}
</script>

<template>
  <div class="dictation-setting" @click.stop>
    <Tooltip :title="`默写模式: ${currentMode.label}`">
      <IconWrapper @click="toggleDropdown">
        <Icon 
          :icon="currentMode.icon" 
          :class="{ 'active': settingStore.dictation !== DictationMode.None }"
        />
      </IconWrapper>
    </Tooltip>
    
    <div v-if="showDropdown" class="dropdown">
      <div class="dropdown-header">
        <Icon icon="majesticons:eye-line" />
        <span>默写模式</span>
      </div>
      
      <div 
        v-for="mode in dictationModes" 
        :key="mode.value"
        class="dropdown-item"
        :class="{ 'selected': mode.value === settingStore.dictation }"
        @click="selectMode(mode.value)"
      >
        <Icon :icon="mode.icon" />
        <div class="mode-info">
          <div class="mode-label">{{ mode.label }}</div>
          <div class="mode-description">{{ mode.description }}</div>
        </div>
        <Icon 
          v-if="mode.value === settingStore.dictation" 
          icon="material-symbols:check" 
          class="check-icon"
        />
      </div>
      
      <div class="dropdown-footer">
        <div class="example-preview">
          <span class="example-label">示例 "hello":</span>
          <span class="example-text" v-html="getExampleText()"></span>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
.dictation-setting {
  position: relative;
  display: inline-block;
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 280px;
  margin-top: 8px;
  overflow: hidden;
  
  .dropdown-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: var(--color-bg-muted);
    font-weight: 600;
    font-size: 14px;
    color: var(--color-text);
    border-bottom: 1px solid var(--color-border);
  }
  
  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    transition: background-color 0.2s;
    border-bottom: 1px solid var(--color-border-light);
    
    &:last-of-type {
      border-bottom: none;
    }
    
    &:hover {
      background: var(--color-bg-hover);
    }
    
    &.selected {
      background: var(--color-primary-bg);
      color: var(--color-primary);
    }
    
    .mode-info {
      flex: 1;
      
      .mode-label {
        font-weight: 500;
        margin-bottom: 2px;
      }
      
      .mode-description {
        font-size: 12px;
        color: var(--color-text-muted);
      }
    }
    
    .check-icon {
      color: var(--color-primary);
    }
  }
  
  .dropdown-footer {
    padding: 12px 16px;
    background: var(--color-bg-muted);
    border-top: 1px solid var(--color-border);
    
    .example-preview {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      
      .example-label {
        color: var(--color-text-muted);
        white-space: nowrap;
      }
      
      .example-text {
        font-family: 'Fira Code', 'Courier New', monospace;
        background: var(--color-bg);
        padding: 4px 8px;
        border-radius: 4px;
        border: 1px solid var(--color-border);
        font-weight: 500;
      }
    }
  }
}

.active {
  color: var(--color-primary);
}
</style>
