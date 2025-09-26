import bookFlag from "@/assets/img/flags/book.png";
import enFlag from "@/assets/img/flags/en.png";
import codeFlag from "@/assets/img/flags/code.png";
import myFlag from "@/assets/img/flags/my.png";
import {DefaultChapterWordNumber} from "@/stores/setting.ts";

export type Word = {
  "name": string,
  "usphone": string,
  "ukphone": string,
  "trans": string[]
  checked?: boolean,
  id?: any,
}

export const DefaultWord: Word = {
  name: '',
  usphone: '',
  ukphone: '',
  trans: []
}

export const PronunciationApi = 'https://dict.youdao.com/dictvoice?audio='

export type TranslateLanguageType = 'en' | 'zh-CN' | 'ja' | 'de' | 'common' | ''
export type LanguageType = 'en' | 'ja' | 'de' | 'code'

export type DictResource = {
  id: string
  name: string
  description: string
  url: string
  length: number
  category: string
  tags: string[]
  translateLanguage: TranslateLanguageType
  type: DictType
  language: LanguageType
}


export enum DictType {
  collect = 'collect',
  simple = 'simple',
  wrong = 'wrong',
  word = 'word',
  article = 'article',
}

export const DefaultArticleWord: ArticleWord = {
  name: '',
  usphone: '',
  ukphone: '',
  trans: [],
  nextSpace: true,
  isSymbol: false,
  symbolPosition: ''
}

export interface ArticleWord extends Word {
  nextSpace: boolean,
  isSymbol: boolean,
  symbolPosition: 'start' | 'end' | '',
}

export interface Sentence {
  text: string,
  translate: string,
  words: ArticleWord[]
}

export enum TranslateType {
  custom = 'custom',
  network = 'network',
  none = 'none'
}

export interface Article {
  id: string,
  title: string,
  titleTranslate: string,
  text: string,
  textCustomTranslate: string,
  textCustomTranslateIsFormat: boolean,//翻译是否格式化
  textNetworkTranslate: string,
  newWords: Word[],
  textAllWords: string[],
  sections: Sentence[][],
  useTranslateType: TranslateType
}

export const DefaultArticle: Article = {
  // id: nanoid(6),
  id: '',
  title: '',
  titleTranslate: '',
  text: '',
  textCustomTranslate: '',
  textNetworkTranslate: '',
  textCustomTranslateIsFormat: false,
  newWords: [],
  textAllWords: [],
  sections: [],
  useTranslateType: TranslateType.custom
}

export interface Statistics {
  startDate: number,//开始日期
  endDate: number//结束日期
  spend: number,//花费时间
  total: number//单词数量
  wrongWordNumber: number//错误数
  correctRate: number//正确率
}

export interface DisplayStatistics extends Statistics {
  wrongWords: Word[]
  inputWordNumber: number//输入数
}

export const DefaultDisplayStatistics: DisplayStatistics = {
  startDate: Date.now(),
  endDate: -1,
  spend: -1,
  total: -1,
  correctRate: -1,
  wrongWordNumber: -1,
  inputWordNumber: -1,
  wrongWords: [],
}

export enum Sort {
  normal = 0,
  random = 1,
  reverse = 2
}

export const ShortcutKeyMap = {
  Show: 'Escape',
  Ignore: 'Tab',
  Remove: '`',
  Collect: 'Enter',
}

export enum ShortcutKey {
  ShowWord = 'ShowWord',
  EditArticle = 'EditArticle',
  Next = 'Next',
  Previous = 'Previous',
  ToggleSimple = 'ToggleSimple',
  ToggleCollect = 'ToggleCollect',
  NextChapter = 'NextChapter',
  PreviousChapter = 'PreviousChapter',
  RepeatChapter = 'RepeatChapter',
  DictationChapter = 'DictationChapter',
  PlayWordPronunciation = 'PlayWordPronunciation',
  // PlayTranslatePronunciation = 'PlayTranslatePronunciation',
  ToggleShowTranslate = 'ToggleShowTranslate',
  ToggleDictation = 'ToggleDictation',
  OpenSetting = 'OpenSetting',
  OpenDictDetail = 'OpenDictDetail',
  ToggleTheme = 'ToggleTheme',
  ToggleConciseMode = 'ToggleConciseMode',
  TogglePanel = 'TogglePanel'
}

// 根据操作系统生成快捷键映射
export function getDefaultShortcutKeyMap() {
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform)
  const cmdOrCtrl = isMac ? 'Cmd' : 'Ctrl'
  
  return {
    [ShortcutKey.EditArticle]: `${cmdOrCtrl}+E`,
    [ShortcutKey.ShowWord]: 'Escape',
    [ShortcutKey.Previous]: 'Alt+⬅',
    [ShortcutKey.Next]: 'Tab',
    [ShortcutKey.ToggleSimple]: '`',
    [ShortcutKey.ToggleCollect]: 'Enter',
    [ShortcutKey.PreviousChapter]: `${cmdOrCtrl}+⬅`,
    [ShortcutKey.NextChapter]: `${cmdOrCtrl}+➡`,
    [ShortcutKey.RepeatChapter]: `${cmdOrCtrl}+Enter`,
    [ShortcutKey.DictationChapter]: 'Alt+Enter',
    [ShortcutKey.PlayWordPronunciation]: `${cmdOrCtrl}+P`,
    // [ShortcutKey.PlayTranslatePronunciation]: `${cmdOrCtrl}+O`,
    [ShortcutKey.ToggleShowTranslate]: `${cmdOrCtrl}+Z`,
    [ShortcutKey.ToggleDictation]: `${cmdOrCtrl}+I`,
    [ShortcutKey.OpenSetting]: `${cmdOrCtrl}+S`,
    [ShortcutKey.ToggleTheme]: `${cmdOrCtrl}+Q`,
    [ShortcutKey.OpenDictDetail]: `${cmdOrCtrl}+J`,
    [ShortcutKey.ToggleConciseMode]: `${cmdOrCtrl}+M`,
    [ShortcutKey.TogglePanel]: `${cmdOrCtrl}+L`,
  }
}

export const DefaultShortcutKeyMap = getDefaultShortcutKeyMap()


export enum TranslateEngine {
  Baidu = 0,
}

export enum DictationMode {
  None = 0,        // 不默写，显示所有字母
  Full = 1,        // 全部隐藏（当前模式）
  VowelsOnly = 2,  // 只隐藏元音字母
  ConsonantsOnly = 3 // 只隐藏辅音字母
}

// 元音字母集合（包括大小写）
export const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'])

// 判断是否为元音字母
export function isVowel(char: string): boolean {
  return VOWELS.has(char)
}

// 判断是否为辅音字母（只判断英文字母）
export function isConsonant(char: string): boolean {
  return /[a-zA-Z]/.test(char) && !isVowel(char)
}

// 根据默写模式生成显示文本
export function getDictationDisplayText(
  originalText: string, 
  dictationMode: DictationMode, 
  showWordLength: boolean = true
): string {
  if (dictationMode === DictationMode.None) {
    return originalText
  }
  
  return originalText.split('').map(char => {
    let shouldHide = false
    
    switch (dictationMode) {
      case DictationMode.Full:
        shouldHide = /[a-zA-Z]/.test(char) // 隐藏所有字母
        break
      case DictationMode.VowelsOnly:
        shouldHide = isVowel(char) // 只隐藏元音
        break
      case DictationMode.ConsonantsOnly:
        shouldHide = isConsonant(char) // 只隐藏辅音
        break
    }
    
    if (shouldHide) {
      return showWordLength ? '_' : '&nbsp;'
    } else {
      return char
    }
  }).join('')
}

export const languageCategoryOptions = [
  {id: 'article', name: '文章', flag: bookFlag},
  {id: 'en', name: '英语', flag: enFlag},
  // {id: 'ja', name: '日语', flag: jpFlag},
  // {id: 'de', name: '德语', flag: deFlag},
  {id: 'code', name: 'Code', flag: codeFlag},
  {id: 'my', name: '我的', flag: myFlag},
]

export const DefaultDict: Dict = {
  id: '',
  name: '',
  description: '',
  sort: Sort.normal,
  originWords: [],//原始单词
  words: [],
  chapterWordNumber: DefaultChapterWordNumber,//章节单词数量
  chapterWords: [],
  residueWords: [],//未分配单词
  chapterIndex: 0,//章节下标
  wordIndex: 0,//单词下标
  articles: [],
  statistics: [],
  isCustom: false,
  length: 0,
  /*资源属性*/
  resourceId: '',
  url: '',
  category: '',
  tags: [],
  translateLanguage: 'common',
  type: DictType.word,
  language: 'en',
}

export interface Dict {
  id: string,
  name: string,
  description: string,
  sort: Sort,
  originWords: Word[],//原始单词
  words: Word[],
  chapterWordNumber: number,//章节单词数量
  chapterWords: Word[][],
  residueWords: Word[],
  chapterIndex: number,//章节下标
  wordIndex: number,//单词下标
  articles: Article[],
  statistics: Statistics[],
  isCustom: boolean,
  length: number,
  /*资源属性*/
  resourceId: string,
  category: string
  tags: string[]
  language: LanguageType
  type: DictType
  translateLanguage: TranslateLanguageType
  url: string,
}

export interface ArticleItem {
  item: Article,
  index: number
}

export interface WordItem {
  item: Article,
  index: number
}

