#include <glib.h>
#include <gtk/gtk.h>
#include <stdlib.h>

static gint repeats = 2;
static gint max_size = 8;
static gboolean verbose = FALSE;
static gboolean beep = FALSE;
static gboolean rands = FALSE;

static GOptionEntry entries[] =
{
    { "repeats", 'r', 0, G_OPTION_ARG_INT, &repeats, "Average over N repetitions", "N" },
    { "max-size", 'm', 0, G_OPTION_ARG_INT, &max_size, "Test up to 2^M items", "M" },
    { "verbose", 'v', 0, G_OPTION_ARG_NONE, &verbose, "Be verbose", NULL },
    { "beep", 'b', 0, G_OPTION_ARG_NONE, &beep, "Beep when done", NULL },
    { "rands", 0, 0, G_OPTION_ARG_NONE, &rands, "Randomize the data", NULL },
    { NULL }
};

int
main (int argc, char *argv[])
{
    GError *error = NULL;
    GOptionContext *context;

    context = g_option_context_new ("- test tree model performance");
    g_option_context_add_main_entries (context, entries, NULL);
    g_option_context_add_group (context, gtk_get_option_group (TRUE));
    if (!g_option_context_parse (context, &argc, &argv, &error))
    {
        g_print ("option parsing failed: %s\n", error->message);
        exit (1);
    }

    /* ... */

    return 0;
}
