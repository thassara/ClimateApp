// import { StyleSheet, Text, View } from "react-native";
// import React, { useEffect } from "react";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import Header from "../../components/Common/Header";
// import SearchBar from "../../components/Common/Searchbar";
// import { NewsDataType } from "../../components/Types/index";
// import axios from "axios";

// type Props = {}

// const Page: React.FC<Props> = (props) => {
//     const {top:safeTop} = useSafeAreaInsets();
//     const [breakingNews, setBreakingNews] = React.useState<NewsDataType[]>([]);

//     useEffect(() => {

//     const getBreakingNews = async () => {
//         try {
//             const URL = `https://newsdata.io/api/1/latest?apikey=${process.env.TESTAPIKEY}&country=us&prioritydomain=top`
//             const response = await axios .get(URL);

//             if(response && response.data) {
//                 console.log("Breaking News:", response.data);
//             }
//     }
// }

//   return (
//     <View style={[styles.container, {paddingTop: safeTop}]}>
//       <Header/> 
//       <SearchBar /> 
//     </View>     
//   );
// }   
// export default Page;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     // Add other default styles as needed
//   },
// });




