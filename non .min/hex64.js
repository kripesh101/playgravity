			var s = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
			var x = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','.',','];
			var b1 = ["0000","0001","0010", "0011", "0100", "0101", "0110", "0111", "1000", "1001", "1010", "1011", "1100", "1101", "1110", "1111"];
			var b2 = ["000000","000001","000010", "000011", "000100", "000101", "000110", "000111", "001000", "001001", "001010", "001011", "001100", "001101", "001110", "001111", "010000", "010001", "010010", "010011", "010100", "010101", "010110", "010111", "011000", "011001", "011010", "011011", "011100", "011101", "011110", "011111", "100000", "100001", "100010", "100011", "100100", "100101", "100110", "100111", "101000", "101001", "101010", "101011", "101100", "101101", "101110", "101111", "110000", "110001", "110010", "110011", "110100", "110101", "110110", "110111", "111000", "111001", "111010", "111011", "111100", "111101", "111110", "111111",];

			function hexDigitToBin(n){
				var en;
				for(var c1 = 0; c1 < 16; c1++){
					if(n == s[c1]){
						en = c1;
						break;
					}
				}
				return b1[en];
			}
			function hexToBin(n){
				var a = n.split(""), l = a.length;
				var ans = [];
				for(var c1 = 0; c1 < l; c1++){
					ans[c1] = hexDigitToBin(a[c1]);
				}
				var z = parseInt(ans[0]);
				z = z.toString();
				ans[0] = z;
				var anss = ans.join("");
				return anss;
			}
			function bin6bitTo64(n){
				var a, en;
				for(var c1 = 0; c1 < 64; c1++){
					if(parseInt(n) == parseInt(b2[c1])){
						en = c1;
						break;
					}
				}
				return x[en];
			}
			function binTo64(n){
				var a = n.split(""), l = a.length;
				var fll = l % 6;
				var sbs = "";
				var anss = "";
				for(var c0 = 0; c0 < fll; c0++){
					sbs += a[c0];
				}
				anss += bin6bitTo64(sbs);
				for(var c1 = fll; c1 < l; c1+=6){
					sbs = "";
					for(var c2 = 0; c2 < 6; c2++){
						sbs += a[c1+c2];
					}
					anss += bin6bitTo64(sbs);
				}
				return anss;
			}
			function binFrom64(n){
				var a = n.split(""), l = a.length;
				var ans = [];
				for(var c1 = 0; c1 < l; c1++){
					ans[c1] = binFrom64digit(n[c1]);
				}
				var z = ans[0] = parseInt(ans[0]);
				z = ans[0].toString();
				ans[0] = z;
				var anss = ans.join("");
				return anss;
			}
			function binFrom64digit(n){
				var en;
				for(var c1 = 0; c1 < 64; c1++){
					if(n == x[c1]){
						en = c1;
						break;
					}
				}
				return b2[en];
			}
			function binToHex(n){
				var a = n.split(""), l = a.length;
				var fll = l % 4;
				var sbs = "";
				var anss = "";
				for(var c0 = 0; c0 < fll; c0++){
					sbs += a[c0];
				}
				if(sbs.length!=0)anss += bin4bitToHex(sbs);
				for(var c1 = fll; c1 < l; c1+=4){
					sbs = "";
					for(var c2 = 0; c2 < 4; c2++){
						sbs += a[c1+c2];
					}
					anss += bin4bitToHex(sbs);
				}
				return anss;
			}
			function bin4bitToHex(n){
				var a, en;
				for(var c1 = 0; c1 < 16; c1++){
					if(parseInt(n) == parseInt(b1[c1])){
						en = c1;
						break;
					}
				}
				return s[en];
			}
			
			function removeLeadingZeroes(n){
				var a = n.split(""), l = a.length;
				for(var c1 = 0; c1 < l; c1++){
					if(a[c1] != "0"){
						break;
					}
					else{
						a.splice(0,1);
						c1--;
						l--;
					}
				}
				var ans = a.join("");
				return ans;
			}
			
			
			function hexTo64(i){
				i = removeLeadingZeroes(i);
				var htb = hexToBin(i);
				var bts = binTo64(htb);
				return bts;
			}
			function hexFrom64(n){
				n = removeLeadingZeroes(n);
				var stb = binFrom64(n);
				var bth = binToHex(stb);
				return bth;
			}
		/*
			hexFrom64 = Base 64 TO Hexa-decimal
			hexTo64 = Hexa-decimal TO Base 64
		*/
	