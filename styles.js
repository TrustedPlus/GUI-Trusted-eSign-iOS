import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    main: {
        flex: 1
    },
    description: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'center',
        color: '#656565'
      },
      container: {
        padding: 30,
        marginTop: 65,
        alignItems: 'center'
      },
      flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
      },
      buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
      },
      tabIcon: {
        width: 16,
        height: 16
      },
      button: {
        height: 36,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center',
        minHeight: 36
      },
      text: {
        fontSize: 18,
        padding: 5,
        flex: 1,
      }
});