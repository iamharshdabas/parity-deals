"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Banner from "@/components/layout/banner";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  productCustomizationFormSchema,
  ProductCustomizationFormSchema,
  ProductCustomizationSelectSchema,
} from "@/schema/product";
import { subtitle } from "@/config/class-variants";
import { updateProductCustomizationAction } from "@/server/action/product/update";
import { toast } from "sonner";
import NoPermissionCard from "@/components/layout/no-permission-card";

export default function CustomizationForm({
  productId,
  clerkId,
  canRemoveBranding,
  canCustomizeBanner,
  productCustomization,
}: {
  productId: string;
  clerkId: string;
  canRemoveBranding: boolean;
  canCustomizeBanner: boolean;
  productCustomization: ProductCustomizationSelectSchema;
}) {
  const form = useForm<ProductCustomizationFormSchema>({
    resolver: zodResolver(productCustomizationFormSchema),
    defaultValues: {
      ...productCustomization,
      classPrefix: productCustomization?.classPrefix ?? "",
    },
  });

  async function onSubmit(rawData: ProductCustomizationFormSchema) {
    const data = { ...rawData, productId };

    const result = await updateProductCustomizationAction(data, {
      clerkId,
      productId,
    });

    if (result?.error) {
      toast.error(result.message);
    }

    if (result.success) {
      toast.success(result.message);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Banner Customization</CardTitle>
        <CardDescription>
          Make it your own! Customize the look and feel of your banner.
        </CardDescription>
        <div className="py-8">
          <h2 className={subtitle()}>Banner Preview</h2>
          <Banner
            message={form.watch("bannerMessage")}
            canRemoveBranding={canRemoveBranding}
            mappings={{
              country: "United States",
              coupon: "SUMMER",
              discount: 20,
            }}
            customizations={form.watch()}
          />
        </div>
        {!canCustomizeBanner && (
          <div className="py-8">
            <NoPermissionCard />
          </div>
        )}
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="bannerMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount message</FormLabel>
                  <FormDescription>
                    Data parameters: ( country ), ( coupon ) and ( discount )
                  </FormDescription>
                  <FormControl>
                    <Textarea {...field} disabled={!canCustomizeBanner} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="backgroundColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background color</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!canCustomizeBanner} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="textColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text color</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!canCustomizeBanner} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bannerContainer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner parent container</FormLabel>
                    <FormDescription>
                      HTML container selector where you want to place the
                      banner. Ex: #container, .container, body
                    </FormDescription>
                    <FormControl>
                      <Input {...field} disabled={!canCustomizeBanner} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="classPrefix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class prefix</FormLabel>
                    <FormDescription>
                      An optional prefix added to all CSS classes to avoid
                      conflicts
                    </FormDescription>
                    <FormControl>
                      <Input {...field} disabled={!canCustomizeBanner} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fontSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Font size</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!canCustomizeBanner} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isSticky"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 pt-2">
                    <FormLabel>Is banner position sticky?</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!canCustomizeBanner}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          {canCustomizeBanner && (
            <CardFooter className="justify-end">
              <Button
                className="w-full sm:w-min"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                Save
              </Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
}
