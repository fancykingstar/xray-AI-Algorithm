import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';


export function Quixote(props)  {
    return (
      <Document>
        <Page style={styles.body} orientation="landscape">
          <View style={styles.pdf}>
            <View style={styles.pdfView}>
              
            </View>
            <View style={styles.viewBody}>
              <View style={styles.left}>
                <Text style={styles.subtitle}>GE Healthcare X-RAY AI EXPERIENCE</Text>
                <Text style={styles.text1}>1 For demonstration only. Not available for sale.</Text>
                <Text style={styles.text2}>2 Heatmap/Pneumothorax score is not available for sale in the US Not approved or cleared by the US FDA.</Text>
              </View>
              <View style={styles.right}>
                <View style={styles.title}>
                  <Image
                    style={styles.arrowImage}
                    src={require('../../assets/cxr.png')}
                  />
                  <Text>REPORT DETAILS</Text>
                </View>
                <View style={styles.quality}>
                  <Text style={styles.quailityTitle}>QUALITY CARE SUITE</Text>
                  <Text style={styles.rotation}>CHEST: AUTO ROTATE</Text>
                  <Text style={styles.result}>Result: </Text>
                  <Text style={styles.protocol}>CHEST: PROTOCOL CHECK</Text>
                  <Text style={styles.result}>Result: </Text>
                  <Text style={styles.view}>CHEST: FIELD OF VIEW CHECK</Text>
                  <Text style={styles.result}>Result: </Text>
                </View>
                <View style={styles.critical}>
                  <Text style={styles.view}>CHEST: FIELD OF VIEW CHECK</Text>
                  <Text style={styles.result}>Result: </Text>
                </View>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    );
};

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  pdf: {
    flex: 1,
    flexDirection: 'row',
  },
  viewBody: {
    flex: 1,
    flexDirection: 'row',
  },
  image: {
    width: 150,
    height: 150
  },
  pdfView: {
    
  },
  pdfImage: {
    width: 70,
    height:87
  },
});
