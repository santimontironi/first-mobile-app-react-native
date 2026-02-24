import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window'); //dimensions sirve para hacer diseños responsivos basados en el tamaño de la pantalla del dispositivo que esté usando la app

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#080c09" />

            <View style={styles.bgCircleLarge} />
            <View style={styles.bgCircleSmall} />
            <View style={styles.bgLine} />

            <View style={styles.topSection}>
                <View style={styles.badge}>
                    <View style={styles.badgeDot} />
                    <Text style={styles.badgeText}>GESTOR DE TAREAS</Text>
                </View>
            </View>

            <View style={styles.centerSection}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoInner}>
                        <Text style={styles.logoIcon}>✓</Text>
                    </View>
                    <View style={styles.logoRing} />
                </View>

                <Text style={styles.title}>Todo lo que{'\n'}necesitas hacer,{'\n'}hecho.</Text>

                <Text style={styles.subtitle}>
                    Organiza, prioriza y completa tus tareas con claridad y sin distracciones.
                </Text>
            </View>

            <View style={styles.bottomSection}>
                <View style={styles.pillsRow}>
                    <View style={styles.pill}>
                        <Text style={styles.pillText}>⚡ Rápido</Text>
                    </View>
                    <View style={styles.pill}>
                        <Text style={styles.pillText}>🎯 Enfocado</Text>
                    </View>
                    <View style={styles.pill}>
                        <Text style={styles.pillText}>🔒 Seguro</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.loginButton}
                    activeOpacity={0.85}
                    onPress={() => navigation?.navigate('Login')}
                >
                    <View style={styles.loginButtonInner}>
                        <Text style={styles.loginButtonText}>Iniciar sesión</Text>
                        <Text style={styles.loginButtonArrow}>→</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.registerRow}>
                    <Text style={styles.registerText}>¿No tienes cuenta? </Text>
                    <Text style={styles.registerLink}>Regístrate gratis</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#080c09',
        paddingHorizontal: 28,
        paddingTop: 60,
        paddingBottom: 48,
        overflow: 'hidden',
    },
    bgCircleLarge: {
        position: 'absolute',
        width: width * 0.85,
        height: width * 0.85,
        borderRadius: width * 0.425,
        borderWidth: 1,
        borderColor: '#1a3825',
        top: -width * 0.25,
        right: -width * 0.3,
        opacity: 0.6,
    },
    bgCircleSmall: {
        position: 'absolute',
        width: width * 0.5,
        height: width * 0.5,
        borderRadius: width * 0.25,
        borderWidth: 1,
        borderColor: '#1f4a2e',
        bottom: height * 0.18,
        left: -width * 0.2,
        opacity: 0.5,
    },
    bgLine: {
        position: 'absolute',
        width: 1,
        height: height * 0.35,
        backgroundColor: '#1e3828',
        bottom: height * 0.12,
        right: 48,
    },
    topSection: {
        top: '10%',
        alignItems: 'flex-start',
        marginBottom: 0,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#0f1e14',
        borderWidth: 1,
        borderColor: '#1e3d28',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 7,
    },
    badgeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#3d9e60',
    },
    badgeText: {
        color: '#3d9e60',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 2,
    },
    centerSection: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 20,
    },
    logoContainer: {
        width: 80,
        height: 80,
        marginBottom: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoInner: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: '#122b1a',
        borderWidth: 1.5,
        borderColor: '#2e6b43',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    logoRing: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 26,
        borderWidth: 1,
        borderColor: '#1e3828',
        borderStyle: 'dashed',
    },
    logoIcon: {
        fontSize: 28,
        color: '#4caf75',
    },
    title: {
        fontSize: 40,
        fontWeight: '900',
        color: '#dff0e4',
        lineHeight: 48,
        letterSpacing: -1.2,
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 15,
        color: '#4a6b55',
        lineHeight: 24,
        letterSpacing: 0.1,
        maxWidth: '85%',
    },
    bottomSection: {
        gap: 16,
        bottom: '8%'
    },
    pillsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    pill: {
        backgroundColor: '#0d1f12',
        borderWidth: 1,
        borderColor: '#1e3828',
        borderRadius: 30,
        paddingHorizontal: 14,
        paddingVertical: 7,
    },
    pillText: {
        color: '#4a7a58',
        fontSize: 12,
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: '#2a7a46',
        borderRadius: 18,
        overflow: 'hidden',
        shadowColor: '#3d9e60',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: 12,
    },
    loginButtonInner: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 28,
        gap: 10,
        backgroundColor: '#236638',
        borderWidth: 1,
        borderColor: '#3d9e60',
        borderRadius: 18,
    },
    loginButtonText: {
        color: '#e8f5e9',
        fontSize: 17,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    loginButtonArrow: {
        color: '#7dd4a0',
        fontSize: 20,
        fontWeight: '300',
    },
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 4,
    },
    registerText: {
        color: '#3a5544',
        fontSize: 14,
    },
    registerLink: {
        color: '#4caf75',
        fontSize: 14,
        fontWeight: '700',
    },
});

export default HomeScreen;