<script lang="ts">
  import { Button } from '@sveltery/components/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/components/card';
  import { Checkbox } from '@sveltery/components/checkbox';
  import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@sveltery/components/field';
</script>

<Card>
  <CardHeader>
    <CardTitle>Contributions & Activity</CardTitle>
    <CardDescription>Manage your contributions and activity visibility.</CardDescription>
  </CardHeader>
  <CardContent>
    <form id="contributions-activity">
      <FieldGroup>
        <FieldSet>
          <FieldLegend class="sr-only">Contributions & activity</FieldLegend>
          <FieldGroup>
            <Field orientation="horizontal">
              <Checkbox id="activity-private-profile" />
              <FieldContent>
                <FieldLabel for="activity-private-profile">Make profile private and hide activity</FieldLabel>
                <FieldDescription>
                  Enabling this will hide your contributions and activity from your GitHub profile and from social features like followers, stars, feeds, leaderboards and releases.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
    </form>
  </CardContent>
  <CardFooter>
    <Button form="contributions-activity" class="style-sera:w-full">Save Changes</Button>
  </CardFooter>
</Card>
