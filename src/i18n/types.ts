export interface TranslationResources {
  header: {
    title: string;
  };
  app: {
    description: string;
    processing: string;
    privacy: string;
    newAnalysis: string;
  };
  fileUpload: {
    title: string;
    dragDrop: string;
    selectFile: string;
    invalidFile: string;
    supportedFormats: string;
  };
  summary: {
    title: string;
    subtitle: string;
    totalValidations: string;
    topStations: string;
    topOperators: string;
    validations: string;
    shareImage: string;
    downloadImage: string;
  };
  howTo: {
    title: string;
    step1: {
      title: string;
      description: string;
      link: string;
    };
    step2: {
      title: string;
      description: string;
    };
    step3: {
      title: string;
      description: string;
    };
    step4: {
      title: string;
      description: string;
    };
    note: string;
    visit: string;
    columnName: string;
  };
  footer: {
    description: string;
    madeWith: string;
    by: string;
    github: string;
  };
  language: {
    selector: string;
    catalan: string;
    spanish: string;
    english: string;
  };
  common: {
    websitePromo: string;
  };
  errors: {
    fileReadError: string;
    emptyFileError: string;
    headersNotFoundError: string;
    invalidFormatError: string;
    noValidationsError: string;
    processingError: string;
    fileLoadError: string;
    invalidDateWarning: string;
    incompleteDataWarning: string;
    processingRowError: string;
  };
}

export type SupportedLanguages = 'ca' | 'es' | 'en';

export interface LanguageOption {
  code: SupportedLanguages;
  name: string;
  flag: string;
  nativeName: string;
}
