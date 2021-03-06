#include <glib.h>
#include <dbus/dbus.h>
#include <dbus/dbus-glib.h>
#include <dbus/dbus-glib-lowlevel.h>

static DBusHandlerResult 
signal_filter(DBusConnection *connection, DBusMessage * message, void *user_data);

int main(int argc, char *argv[])
{
    GMainLoop *loop;
    DBusConnection *bus;
    DBusError error;

    /* Start loop */
    loop = g_main_loop_new(NULL, FALSE);

    dbus_error_init(&error);
    bus = dbus_bus_get(DBUS_BUS_SESSION, &error);
    if (!bus) {
        g_warning("Failed to connect to the D-BUS dademon: %s", error.message);
        dbus_error_free(&error);
        return 1;
    }
    dbus_connection_setup_with_g_main(bus, NULL);

    /* Listening to message from all objects as no path is specified */
    dbus_bus_add_match(bus, "type='signal', interface='com.burtonini.dbus.Signal'", &error);
    dbus_connection_add_filter(bus, signal_filter, loop, NULL);
 
    g_main_loop_run(loop);
    /* Loop over */

    return 0;
}

static DBusHandlerResult 
signal_filter(DBusConnection *connection, DBusMessage * message, void *user_data)
{
    /* User data is the event loop we are running in */
    GMainLoop *loop = user_data;

    /* A signal from the bus saying we are about to be disconnected */
    if (dbus_message_is_signal(message, "com.burtonini.dbus.Signal",
                               "Disconnected")) {
        /* Tell the main loop to quit */
        g_main_loop_quit(loop);

        /* We have handled this message, don't pass it on */
        return DBUS_HANDLER_RESULT_HANDLED;
    } else if (dbus_message_is_signal(message, "com.burtonini.dbus.Signal", "Ping")) {
    /* A Ping signal on the com.burtonini.dbus.Signal interface */
        DBusError error;
        const char *str;
        
        dbus_error_init(&error);
        if (dbus_message_get_args(message, &error, DBUS_TYPE_STRING, &str, DBUS_TYPE_INVALID)) {
            g_print("Ping received: %s\n", str);
         } else {
            g_print("Ping received, but error getting message: %s\n", error.message);
            dbus_error_free(&error);
        }
        
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    
    return DBUS_HANDLER_RESULT_NOT_YET_HANDLED;
}
