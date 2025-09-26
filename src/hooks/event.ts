import {onMounted, onUnmounted, watch} from "vue";
import {emitter, EventKey} from "@/utils/eventBus.ts";
import {useRuntimeStore} from "@/stores/runtime.ts";
import {useSettingStore} from "@/stores/setting.ts";

export function useWindowClick(cb: (e: PointerEvent) => void) {
    onMounted(() => {
        emitter.on(EventKey.closeOther, cb)
        window.addEventListener('click', cb)
    })
    onUnmounted(() => {
        window.removeEventListener('click', cb)
    })
}

export function useEventListener(type: string, listener: EventListenerOrEventListenerObject) {
    onMounted(() => window.addEventListener(type, listener))
    onUnmounted(() => window.removeEventListener(type, listener))
}

export function getShortcutKey(e: KeyboardEvent) {
    let shortcutKey = ''
    
    // macOS 兼容性：检查 Meta 键（Cmd）和 Ctrl 键
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform)
    const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey
    
    if (cmdOrCtrl) {
        shortcutKey += isMac ? 'Cmd+' : 'Ctrl+'
    }
    if (e.altKey) shortcutKey += 'Alt+'
    if (e.shiftKey) shortcutKey += 'Shift+'
    
    // 跳过修饰键本身
    if (e.key !== 'Control' && e.key !== 'Alt' && e.key !== 'Shift' && e.key !== 'Meta') {
        if (e.keyCode >= 65 && e.keyCode <= 90) {
            shortcutKey += e.key.toUpperCase()
        } else {
            if (e.key === 'ArrowRight') {
                shortcutKey += '➡'
            } else if (e.key === 'ArrowLeft') {
                shortcutKey += '⬅'
            } else if (e.key === 'ArrowUp') {
                shortcutKey += '⬆'
            } else if (e.key === 'ArrowDown') {
                shortcutKey += '⬇'
            } else {
                shortcutKey += e.key
            }
        }
    }
    shortcutKey = shortcutKey.trim()

    // console.log('🔑 Shortcut key detected:', shortcutKey)
    return shortcutKey
}

export function useStartKeyboardEventListener() {
    const runtimeStore = useRuntimeStore()
    const settingStore = useSettingStore()
    
    // 检测是否为 Edge 浏览器
    const isEdge = /Edg\//.test(navigator.userAgent)
    // console.log('🔍 Browser detection - Is Edge:', isEdge, 'UserAgent:', navigator.userAgent)

    // Edge 浏览器兼容性修复 - 使用 keypress 事件作为主要监听器
    if (isEdge) {
        useEventListener('keypress', (e: KeyboardEvent) => {
            // console.log('Edge keypress:', {key: e.key, keyCode: e.keyCode, code: e.code})
            if (!runtimeStore.disableEventListener && e.key.length === 1) {
                // 对于字母按键，直接触发输入事件
                if (/^[a-zA-Z]$/.test(e.key)) {
                    // console.log('Edge: Letter key detected, triggering onTyping')
                    emitter.emit(EventKey.onTyping, e)
                    return
                }
            }
        })
    }

    // 备用事件监听器 - 适用于所有浏览器
    useEventListener('keypress', (e: KeyboardEvent) => {
        console.log('Global keypress (backup):', {key: e.key, keyCode: e.keyCode, code: e.code})
        if (!runtimeStore.disableEventListener && e.key.length === 1 && !isEdge) {
            console.log('Backup keypress handler triggered')
            emitter.emit(EventKey.onTyping, e)
        }
    })

    useEventListener('keydown', (e: KeyboardEvent) => {
        // console.log('Global keydown:', {key: e.key, keyCode: e.keyCode, code: e.code, disableEventListener: runtimeStore.disableEventListener})
        if (!runtimeStore.disableEventListener) {
            e.preventDefault()
            let shortcutKey = getShortcutKey(e)
            // console.log('shortcutKey', shortcutKey)

            let list = Object.entries(settingStore.shortcutKeyMap)
            let shortcutEvent = ''
            for (let i = 0; i < list.length; i++) {
                let [k, v] = list[i]
                if (v === shortcutKey) {
                    console.log('快捷键', k)
                    shortcutEvent = k
                    break
                }
            }
            if (shortcutEvent) {
                emitter.emit(shortcutEvent, e)
            } else {
                //非英文模式下，输入区域的 keyCode 均为 229时，
                // Edge 浏览器跳过字母按键的 keydown 处理，因为已经在 keypress 中处理了
                const isLetterKey = e.keyCode >= 65 && e.keyCode <= 90
                if (isEdge && isLetterKey) {
                    console.log('Edge: Skipping letter key in keydown handler')
                    return
                }
                
                if ((e.keyCode >= 65 && e.keyCode <= 90)
                    || (e.keyCode >= 48 && e.keyCode <= 57)
                    || e.code === 'Space'
                    || e.code === 'Slash'
                    || e.code === 'Quote'
                    || e.code === 'Comma'
                    || e.code === 'BracketLeft'
                    || e.code === 'BracketRight'
                    || e.code === 'Period'
                    || e.code === 'Minus'
                    || e.code === 'Equal'
                    || e.code === 'Semicolon'
                    // || e.code === 'Backquote'
                    || e.keyCode === 229
                ) {
                    emitter.emit(EventKey.onTyping, e)
                } else {
                    emitter.emit(EventKey.keydown, e)
                }
            }

        }
    })
    useEventListener('keyup', (e: KeyboardEvent) => {
        if (!runtimeStore.disableEventListener) {
            emitter.emit(EventKey.keyup, e)
        }
    })
}

export function useOnKeyboardEventListener(onKeyDown: (e: KeyboardEvent) => void, onKeyUp: (e: KeyboardEvent) => void) {
    onMounted(() => {
        emitter.on(EventKey.keydown, onKeyDown)
        emitter.on(EventKey.keyup, onKeyUp)
    })
    onUnmounted(() => {
        emitter.off(EventKey.keydown, onKeyDown)
        emitter.off(EventKey.keyup, onKeyUp)
    })
}

export function useDisableEventListener(watchVal: any) {
    const runtimeStore = useRuntimeStore()
    watch(watchVal, (n: any) => {
        if (n === true) runtimeStore.disableEventListener = true
        if (n === false) runtimeStore.disableEventListener = false
    })
    onMounted(() => {
        if (watchVal() === undefined) {
            runtimeStore.disableEventListener = true
        }
    })
    onUnmounted(() => {
        if (watchVal() === undefined) {
            runtimeStore.disableEventListener = false
        }
    })
}
