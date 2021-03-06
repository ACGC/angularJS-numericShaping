angular.module('arabicNumericShapingSupport',[])
	.filter('contextuallyShapeDigits', function contextuallyShapeDigitsFilter(){

			var regex = /([0-9])|([\u0660-\u0669])|([\u0608\u060B\u060D\u061B-\u064A\u066D-\u066F\u0671-\u06D5\u06E5-\u06E6\u06EE-\u06EF\u06FA-\u06FF\u0750-\u077F\u08A0-\u08E3\u200F\u202B\u202E\u2067\uFB50-\uFD3D\uFD40-\uFDCF\uFDF0-\uFDFC\uFDFE-\uFDFF\uFE70-\uFEFE]+)|([^0-9\u0660-\u0669\u0608\u060B\u060D\u061B-\u064A\u066D-\u066F\u0671-\u06D5\u06E5-\u06E6\u06EE-\u06EF\u06FA-\u06FF\u0750-\u077F\u08A0-\u08E3\u200F\u202B\u202E\u2067\uFB50-\uFD3D\uFD40-\uFDCF\uFDF0-\uFDFC\uFDFE-\uFDFF\uFE70-\uFEFE\u0600-\u0607\u0609-\u060A\u060C\u060E-\u061A\u064B-\u066C\u0670\u06D6-\u06E4\u06E7-\u06ED\u06F0-\u06F9\u08E4-\u08FF\uFD3E-\uFD3F\uFDD0-\uFDEF\uFDFD\uFEFF\u0000-\u0040\u005B-\u0060\u007B-\u007F\u0080-\u00A9\u00AB-\u00B4\u00B6-\u00B9\u00BB-\u00BF\u00D7\u00F7\u02B9-\u02BA\u02C2-\u02CF\u02D2-\u02DF\u02E5-\u02ED\u02EF-\u02FF\u2070\u2074-\u207E\u2080-\u208E\u2100-\u2101\u2103-\u2106\u2108-\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A-\u213B\u2140-\u2144\u214A-\u214D\u2150-\u215F\u2189\uA720-\uA721\uA788\uFF01-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFFE0-\uFFE6\uFFE8-\uFFEE]+)/g;
			
			var _shapeArabic = function(/*String*/text) {
    		// summary:
    		//      Converts the digits in the text to Arabic digits.
    		// text: String
    		//      The text to be shaped.
    		// return:
    		//      The shaped string in Arabic format.
    		// tags:
    		//      private

    		return text.replace(/[0-9]/g, function(c) {
    			return String.fromCharCode(parseInt(c) + 1632);
    		});
    	}
		
		var _shapeContextual = function(/*String*/text, /*int*/context) {
    		// summary:
    		//      Converts the digits in the text to European or Arabic digits
    		//      According to the type of the preceding strong character.
    		// text: String
    		//      The text to be shaped.
    		// context: int
    		//      The current effective context.
    		//      If the value is 1, the digits will shaped to European.
    		//      If the value is 2, the digits will shaped to Arabic.
    		//      Allowed values:
    		//      '1': European context
    		//      '2': Arabic context
    		// return:
    		//      The shaped string.
    		// tags:
    		//      private

    		return text.replace(regex, function(match, latinDigit, arabicDigit, strongArabic, strongLatin){
    			if(latinDigit){
    				return context === 2 ? String.fromCharCode(parseInt(latinDigit) + 1632) : latinDigit;
    			}else if(arabicDigit){
    				return context === 1 ? arabicDigit.charCodeAt(0) - 1632 : arabicDigit;
    			}else if(strongArabic){
    				context = 2;
    			}else if(strongLatin){
    				context = 1;
    			}
    			return match;		// default: keep this text as-is
    		});
    	}
			return function contextuallyShapeDigits(/*String*/text, /*String*/shaperType, /*String*/textDir){
				// summary:
    		//      Converts the digits in the text to Arabic digits
    		//      According to the shaperType & the textDir.
    		// description:
    		//      This function is intended to convert the digits in the input
    		//      Text from European to Arabic according to The shaperType & the textDir as the following:
    		//      1-Arabic: if shaperType = 'National'.
    		//      2-Arabic: if shaperType = 'Contextual' & the preceding character is Arabic.
    		//      3-Arabic: if shaperType = 'Contextual' & textDir='rtl' & no preceding strong character.
    		//      4-European: otherwise.
    		// text: String
    		//      The text to be shaped.
    		// shaperType: String
    		//      The type of the shaper to be used.
    		//      Allowed values:
    		//      1."national"
    		//      2."none"
    		//      3."contextual"
    		// textDir: String
    		//      The direction of the input text.
    		//      Allowed values:
    		//      1. "ltr"
    		//      2. "rtl"
    		//      3. "auto"
    		// returns:
    		//      The shaped string.

    		if(!text) {
    			return text;
    		}
    		text = new String(text);
			switch(shaperType){
    			case "national":
    				return _shapeArabic(text);
    			case "contextual":
    				return _shapeContextual(text, textDir === "rtl" ? 2 : 1);
    			default: return text.toString();
    		}
				
			};
		});
    