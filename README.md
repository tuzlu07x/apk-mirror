# Usage

## proxyList.js

## POSTMANLINK

- Asağıdaki linkten postmandaki endpoint isteklerini kullanabilirsiniz.

[Postman Link](https://www.postman.com/dark-station-425448/workspace/apk-mirror/collection/20110215-76a2e8bc-7ca8-409e-be83-951c4691cdd6?action=share&creator=20110215)

Bu sayfada öncelikle verileri alabilmek icin proxy eklemeniz gerekiyor.

```js
export const proxies = [{ ip: "111.111.111.11", port: "1111" }];
```

## .env

Env dosyasinin Configuration ayarlarını yapacaksınız. Burada port, mongo uri, redis ve proxy ile alakali configureler var.

```
PORT=3000
MONGO_URI=mongodb://0.0.0.0:27017/apk-mirror
APK_MIRROR_BASE_URI=https://www.apkmirror.com

REDIS_PORT=6379
REDIS_URL=redis://redis:6379
PROXY_USERNAME="xxxxxx"
PROXY_PASSWORD="yyyyyy"
```

## Docker run

Yukaridaki ayarları yaptıktan sonra dockeri ayağa kaldırabilirsiniz.

```
docker compose up -d
```

## Apk Mirror Scraping

### ApkDistribution.js

`app/apkMirror` dizininde ApkDistribution class ile Instagram uygulamasına ait son 10 APK dağıtımını, beta ve alfa sürümlerini dahil etmeden versionId'leri aliniyor. Ve data arrayine aktariliyor.

#### API Referansı

ApkDistribution Class'ı

- constructor(data: Array): Yeni bir ApkDistribution örneği oluşturur. İsteğe bağlı olarak, başlangıç verilerini data parametresi ile alabilirsiniz.
- getData(): Array: Mevcut veri dizisini döndürür.
- request(): Promise: Apk dağıtımlarını çekmek için HTTP isteği yapar.

* Metodlar

- pushData(): Promise: Her bir sayfa için APK verilerini çeker ve ana veri dizisine ekler.

- eachApkRows(apkRows: Cheerio, $: Function): void: Her bir APK satırını işler ve filtreler.

- filterCondination(apkName: string): boolean: Verilen APK adının belirli koşulları sağlayıp sağlamadığını kontrol eder.

- versionId(apkName: string): string: Verilen APK adından sürüm kimliğini ayıklar ve döndürür.

Notlar
Bu programın çalışması için process.env.APK_MIRROR_BASE_URI ortam değişkeninin tanımlı olması gerekmektedir.

#### Usage

Ornek kullanımı asağıdaki gibidir.

```js
import ApkDistribution from "./app/apkMirror/ApkDistribution";

// ApkDistribution sınıfını oluştur
const apkDistribution = new ApkDistribution();

// Verileri çek
apkDistribution
  .request()
  .then(() => {
    // Verileri alma
    const data = apkDistribution.getData();
    console.log(data);
  })
  .catch((error) => {
    console.error("Hata oluştu:", error);
  });
```

### ApkVariant.js

`app/apkMirror` dizininde `ApkVariant.js` class ile `ApkDistribution.js` classında aldığımız versionId'lere ait variantların bilgilerinin alındığı classtır.

#### API Referansı

ApkVariantScraping Class

- constructor(versionId: string): Yeni bir ApkVariantScraping örneği oluşturur. versionId parametresi, varyant bilgilerini çekmek için kullanılacak olan APK sürümünün kimliğini belirtir.

- getData(): Array: Mevcut veri dizisini döndürür.

- request(): Promise: Varyant bilgilerini çekmek için HTTP isteği yapar.

* Metodlar

- pushData(apkVariants: Cheerio, $: Function): void: Her bir varyantın bilgilerini ana veri dizisine ekler.

- getRandomProxy(): Object: Rastgele bir proxy döndürür.

- delay(ms: number): Promise: Belirli bir süre bekler.

- setVariantIdAccordingUrl(): string: URL'ye uygun varyant kimliğini ayarlar ve döndürür.

### Jobs

#### ApkMirrorMergeService

`app/Services` dizininde `ApkMirrorMergeService.js` classi ise oluşturulan versionId'nin variantIdlerinin eşleştirilip `redis` ile queue'ya gönderilen aşamadır.

##### Usage

```js
import ApkMirrorMergeService from "./app/Services/ApkMirrorMergeService";

// ApkMirrorMergeService sınıfını oluştur
const apkMirrorMergeService = new ApkMirrorMergeService();

// Servisi çalıştır
apkMirrorMergeService
  .send()
  .then((response) => {
    console.log("Servis başarıyla tamamlandı:", response);
  })
  .catch((error) => {
    console.error("Serviste hata oluştu:", error);
  });
```

#### ApkMirrorJob

Bu modül, Apk Mirror'den alınan APK varyant bilgilerini işlemek için kullanılan bir iş kuyruğu yöneticisidir. Bu kuyruk, Redis veritabanını kullanarak verileri depolar ve işler.

#### Usage

```js
import apkMirrorJob from "./app/jobs/ApkMirrorJob";

// Apk Mirror iş kuyruğunu başlat
apkMirrorJob.on("completed", (job) => {
  console.log("İş tamamlandı:", job);
});

apkMirrorJob.on("failed", (job, error) => {
  console.error("İş hatası:", error);
});

// Apk Mirror iş kuyruğunu işleme al
apkMirrorJob.process();
```

### ScrapingMirrorController

Burasi ise yukarıdaki işlemleri gerçeklestirip queue'ya datalari gönderip dataların veritabanına yazılması görevini yapıyor. Postman üzerinden asağıdaki url'ye istek atıldığında bu işlemleri gerçekleştirecek.

### Route

`localhost:3000/getApiMirror` adresine get isteği atıldığında Veritabanına yazma işlemi gerçeklestirilecektir.

```js
router.get("/getApiMirror", async (req, res) => {
  try {
    const variants = getApkMirror();
    res.status(200).json({ message: "Data adding..." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching variants." });
  }
});
```

# CRUD Islemleri

## VariantService

`app/Services` dizininde `VariantService.js` classi ile `list`, `update` ve `delete` crud islemleri gerceklestirilip `app/controllers/VariantController.js` tarafindan ilgili methodlar donduruluyor.

### Routes

`/routes/variantRouter.js` dosyasında routeleri belirneiyor

```js
import { list, update, destroy } from "../app/controllers/VariantController.js";

router.get("/api/variant/list", list);
router.put("/api/variant/update/:variantCode", update);
router.delete("/api/variant/delete/:variantCode", destroy);
```

## VariantCheckService

Burada opsionel olarak verilen;

1. Ayrı bir POST endpoint yazarak gelen isteğin, uygun olup olmadığını döndürebilirsiniz. Örneğin bu
   endpoint için params olarak bir "agent" verisi gelsin ve;
   Instagram 263.2.0.19.104 Android (21/5; 280dpi; 720x1382; samsung; SM-A105F; a10; exynos7884B;
   en_IN; 366308842)
   şeklinde olsun, buradan versiyon id(263.2.0.19.104), varyant id(366308842), android versiyonu(21/5)
   ve dpi bilgisini parse edelim ardından buradan gelen varyant id ile veritabanında kayıtlı varyant id'ye
   kayıtlı verileri çekelim. Bu iki taraftan gelen android versiyonu ve dpi bilgisi karşılaştırılarak uygun olup
   olmadığının çıktısını basalım. Örneğin gelen istekte Android versiyonu 5 ancak veritabanında bu
   varyant id ye ait minimum android versiyonun 9 olabileceği bilgisi mevcut. Dolayısıyla status: fail
   olarak bir çıktı istiyoruz.

Kismi tamamlanmistir.

```js
async checkCompatibility(agentData) {
    agentData = this.parseAgent(agentData);
    console.log(agentData.variantId);
    const variant = await this.variantRepository.findByVariantCode(
      agentData.variantId
    );
    if (!variant) throw new Error("Variant is not defined");
    const { minVersion, screenDpi } = variant;
    const { minAndroidVersion, minDpi } = agentData;
    console.log(variant);

    if (
      parseInt(minVersion) < minAndroidVersion ||
      parseInt(screenDpi) < minDpi
    ) {
      return false;
    }
    return true;
  }
```

### Route

```js
import { checkVariant } from "../app/controllers/VariantCheckController.js";

router.post("/api/variant/check", checkVariant);
```
