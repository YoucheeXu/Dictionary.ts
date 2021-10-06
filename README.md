## 授权申明

本软件在[MIT](https://mths.be/mit)许可证下提供，但是仅仅提供用于非商业目的。

## 免责申明

本软件及本软件所使用了一些网上代码及资源是以研究或个人/学习交流为目的，未经原公司（作者）许可请勿用于任何商业用途，如需商用请自行联系原公司（作者）商议商用事宜！请勿擅自或私自商用！否则后果自负！

本软件及作者不承担因使用、分发、再开发等所带来侵权或其它法律责任。

## 系统要求

本软件目前只在Win10 20H2 x64 测试运行过，理论上可以运行在Linux或Mac OS上，但未测试

## 安装

### 安装node.js

推荐安装node-v15.4.0-x64.msi

### 安装cnpm

#### 输入以下命令

```bash
npm install -g cnpm --registry=https://registry.npm.taobao.org
```
#### 输入cnpm -v输入是否正常

```bath
cnpm -v
```

#### 解决cnpm报错

如果报错：无法加载文件 %AppData%\Roaming\npm\cnpm.ps1，因为在此系统上禁止运行脚本

以管理员身份运行power shell

输入

```bash
set-ExecutionPolicy RemoteSigned
```

然后输入A，回车

### 批量导入安装包

```bash
cnpm install
```

## 格式说明

软件运行需要相关字典文件，由于字典文件受版权保护，所以无法提供。以下只是字典格式说明

### Google.zip

位于 ./bin/dict，该文件为压缩文件格式。以26个字母为一级文件夹，以a/able.json存储原Google的API接口所提供的单词字典json文件。

### Google.zip

位于 ./bin/audio，该文件为压缩文件格式。以26个字母为一级文件夹，以a/able.mp3存储原Google的API接口所提供的单词发音mp3文件。

### 15000.dict

位于 ./bin/dict，该文件为sqlite格式。该字典会被用于背单词时显示示音标含义、例句等。其存储格式如下：

```sqlite
CREATE TABLE [Words](
    [Word] CHAR(255) CONSTRAINT [PrimaryKey] PRIMARY KEY, 
    [Symbol] CHAR(255), 
    [Meaning] CHAR(255), 
    [Sentences] TEXT
);
```

其中Sentences为该单词使用例句。

### *.progress

位于 ./bin/dict，该文件为sqlite格式。里面包含以相应Level命名的表格用来记录用户背单词的进度，格式如下：

```sqlite
CREATE TABLE ${Level}(
    Word text NOT NULL PRIMARY KEY,
    Familiar REAL,
    LastDate DATE,
    NextDate DATE
);
```

其中Familiar用于记录用户对单词的熟练程度（从最不熟悉-10，到最熟悉10）；LastDate用于记录用户上次背诵该单词的时间；NextDate用于记录根据遗忘曲线，下次需要复习单词的时间。

### Words.dict

位于 ./bin/dict，该文件为sqlite格式。该字典会被用于背单词时，根据Level建立所需背单词列表。其存储格式如下：

```sqlite
CREATE TABLE [Words](
    [Word] CHAR(255) CONSTRAINT [PrimaryKey] PRIMARY KEY, 
    [USSymbol] CHAR(255),
	[UKSymbol] CHAR(255),
    [Level] CHAR(255),
	[Stars] TINYINT
);
```

Level内容如”CET4“或”CET6;TOFEL“等

