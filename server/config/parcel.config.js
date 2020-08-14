const Bundler = require('parcel-bundler')
const path = require('path')
// develop, production 모드에 따라서 번들링 설정을 다르게 할 예정입니다.
const isProd = process.env.NODE_ENV === false;//'production'

const defaultOption = {
    outDir: path.join(__dirname, '..', 'components/dist'), // 빌드 결과물이 저장될 디렉토리. 기본값은 dist
    publicUrl: '/', // 서버상의 위치. 기본값은 '/'
    watch: true, // 파일 변경을 감지해서 변경시 다시 빌드할지 여부. 기본값은 process.env.NODE_ENV !== 'production'
    cache: true, // 캐시를 활성화할지 여부. 기본값은 true
    cacheDir: '.cache', // 캐시를 저장할 디렉토리. 기본값은 .cache
    minify: false, // 파일 미니파이케이션. process.env.NODE_ENV === 'production'면 활성화됨.
    target: 'browser', // browser/node/electron, 기본값은 browser
    https: false, // 파일을 https로 서빙할지 http로 할지 여부. 기본값은 false
    logLevel: 1, // 3 = 모든것을 로깅, 2 = 경고와 에러를 로깅, 1 = 에러만 로깅
    hmrPort: 0, // HMR 소켓이 돌아갈 포트번호. 기본값은 무작위의 빈 포트 (node.js에서 0은 무작위의 빈 포트로 배정됨)
    sourceMaps: true, // 소스맵을 활성화할지 여부. 기본값은 활성화 (아직 미니파이드 빌드에선 지원되지 않음)
    hmrHostname: '', // 빠른 모듈 교체를 위한 hostname.기본값은 ''
    detailedReport: false // 번들, 애셋, 파일 크기, 빌드 시간을 담은 상세한 리포트를 출력. 기본값은 false. 리포트는 오직 watch가 비활성일때만 출력됨
};
// var file = './components/articleList';
// const parcel_options = {
//   outDir: './components/dist', // 빌드 결과물이 저장될 디렉토리. 기본값은 dist
//   outFile: 'articleList.html', // 결과물의 파일명
//   publicUrl: '/', // 서버상의 위치. 기본값은 '/'
//   watch: true, // 파일 변경을 감지해서 변경시 다시 빌드할지 여부. 기본값은 process.env.NODE_ENV !== 'production'
//   cache: true, // 캐시를 활성화할지 여부. 기본값은 true
//   cacheDir: '.cache', // 캐시를 저장할 디렉토리. 기본값은 .cache
//   minify: false, // 파일 미니파이케이션. process.env.NODE_ENV === 'production'면 활성화됨.
//   target: 'browser', // browser/node/electron, 기본값은 browser
//   https: false, // 파일을 https로 서빙할지 http로 할지 여부. 기본값은 false
//   logLevel: 1, // 3 = 모든것을 로깅, 2 = 경고와 에러를 로깅, 1 = 에러만 로깅
//   hmrPort: 0, // HMR 소켓이 돌아갈 포트번호. 기본값은 무작위의 빈 포트 (node.js에서 0은 무작위의 빈 포트로 배정됨)
//   sourceMaps: true, // 소스맵을 활성화할지 여부. 기본값은 활성화 (아직 미니파이드 빌드에선 지원되지 않음)
//   hmrHostname: '', // 빠른 모듈 교체를 위한 hostname.기본값은 ''
//   detailedReport: false // 번들, 애셋, 파일 크기, 빌드 시간을 담은 상세한 리포트를 출력. 기본값은 false. 리포트는 오직 watch가 비활성일때만 출력됨
// };

// const parcel_bundler = new parcelBundler(file, parcel_options)
// 모드에 따라 옵션을 설정합니다.
let option
if (isProd) {
    option = {
  }
} else {
    option = {
  }
}

// 번들러를 선언해줍니다.
const bundler = new Bundler('../components/', Object.assign({}, defaultOption, option))

module.exports = bundler