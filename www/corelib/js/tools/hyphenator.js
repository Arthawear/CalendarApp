var Hyphenator = (function() {
    var hyphenator = {};
    hyphenator.konsonanten = ["b","c","d","f","g","h","j","k","l","m","n","p","q","r","s","t","v","w","x","y","z",
        "B","C","D","F","G","H","J","K","L","M","N","P","Q","R","S","T","V","W","X","Y","Z"];
    hyphenator.vokale = ["a","e","i","o","u", "A","E","I","O","U"];

    //rule 3, not cuttable
    hyphenator.rule3 = [ "sch", "ch", "sh", "ph", "th", "rh", "gh", "ck" ];
    //rule 7
    hyphenator.rule7 = [ "ig","in","ung","er" ];
    //rule 10
    hyphenator.rule10 = [ "wor","dar","hin","her" ];

    hyphenator.configuration = {
        minWordLength: 10,
        cutUnbreakableWords: false,
        cutSign: "&shy;"
    }

    hyphenator.config = function (config) {
        hyphenator.configuration = fixConfig(config);
    }

    function fixConfig (config) {
        if (config.cutUnbreakableWords == null) config.cutUnbreakableWords = true;
        if (!config.minWordLength) config.minWordLength = 10;
        if (!config.cutSign) config.cutSign = "&shy;";
        return config;
    }

    hyphenator.applyRule7 = function (word) {

        //rule 7
        var fixPatterns = [];
        for (var r=0; r<hyphenator.rule7.length; r++) {
            var rule = hyphenator.rule7[r];

            //check if str contains the rule
            var pos = word.indexOf(rule);
            while (pos !=-1) {
                var nextPosAdd = 1;
                //console.log("r7="+rule+" on "+pos);

                //get pre
                var preStr = word.substring(0, pos);
                var takeOverStr = null;
                var takeOver = preStr.endsWithMulti(hyphenator.rule3);
                if (takeOver) {
                    //we have to take uncuttable rules with us
                    //console.log(" - pre="+takeOver);
                    takeOverStr = takeOver+rule;
                } else {
                    //no takeover, check, if konsonant is leading
                    takeOver = preStr.endsWithMulti(hyphenator.konsonanten);
                    if (takeOver) {
                        //console.log(" - pre_conso="+takeOver);
                        takeOverStr = takeOver+rule;
                    }
                }

                if (takeOverStr) {
                    word = word.replace(new RegExp(takeOverStr, "g"),hyphenator.configuration.cutSign+"*"+fixPatterns.length+"*");
                    fixPatterns.push({ str: takeOverStr, idx: fixPatterns.length});
                    //console.log(word);
                }


                pos = word.indexOf(rule, pos+nextPosAdd);
            }


            //str = str.replace(new RegExp("*"+r+"*", "g"),"-*"+r+"*");
            //str = str.replace(/\*#\*/g,replaceStr);
            //console.log(fixPatterns);
            for (var f=0; f<fixPatterns.length; f++) {
                word = word.replace(new RegExp("\\*"+fixPatterns[f].idx+"\\*", "g"),fixPatterns[f].str);
            }
            fixPatterns = [];
        }

        return word;
    }

    hyphenator.hyphenateWord = function (word) {
        if (word.length >= hyphenator.configuration.minWordLength) {
            //word is longer than allowed

            if (word.indexOf("-") != -1) {
                //word has - signs
                //TODO check word parts...
            } else {
                word = hyphenator.applyRule7(word);

                if (word.indexOf(hyphenator.configuration.cutSign) == -1) {
                    //not cutted!
                    if (hyphenator.configuration.cutUnbreakableWords) {
                        //do cutting after x chars

                        //console.log(hyphenator.configuration.minWordLength);
                        var cuttedWord = "";
                        var tmpWord = word;
                        while (tmpWord.length>hyphenator.configuration.minWordLength) {
                            //word is still bigger than min length
                            if (cuttedWord.length>0) cuttedWord += hyphenator.configuration.cutSign;
                            cuttedWord += tmpWord.substring(0,hyphenator.configuration.minWordLength);
                            tmpWord = tmpWord.substring(hyphenator.configuration.minWordLength, tmpWord.length);
                        }
                        if (tmpWord.length>0) {
                            if (cuttedWord.length>0) cuttedWord += hyphenator.configuration.cutSign;
                            cuttedWord += tmpWord;
                        }
                        word = cuttedWord;
                    }
                }
            }
        }

        return word;
    }

    hyphenator.hyphenateSentence = function (sentence, overrideConfig) {
        //console.info("hyphenateSentence: "+sentence);
        if (!sentence) return "";
        var configBackup = hyphenator.configuration;
        if (overrideConfig) {
            hyphenator.configuration = fixConfig(overrideConfig);
        }

        var words = sentence.split(" ");
        for (var w=0; w<words.length; w++) {
            var word = words[w];
            var wordHyphenated = hyphenator.hyphenateWord(word);
            words[w] = wordHyphenated;
        }

        hyphenator.configuration = configBackup;
        //console.info(" -> "+words.join(" "));
        return words.join(" ");
    }



    return hyphenator;
})();